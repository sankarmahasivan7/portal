import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import { User } from '../models/User';
import { ProgrammingLanguage } from '../models/ProgrammingLanguage';
import { Examination } from '../models/Examination';
import { ExaminationSlot } from '../models/ExaminationSlot';
import { StudentProgress } from '../models/StudentProgress';
import { ProgressionService } from '../services/ProgressionService';
import { runSeed } from '../scripts/seed';

describe('College Programming Assessment Portal - Backend Test Suite', () => {
  let adminToken: string;
  let student1Token: string;
  let student1Id: string;
  let cLanguageId: string;
  let pythonLanguageId: string;
  let cExamLevel1Id: string;
  let cExamLevel2Id: string;
  let cSlotLevel1Id: string;
  let cSlotLevel2Id: string;

  beforeAll(async () => {
    // Seed test database
    await runSeed();
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college_assessment_db');

    // Login as Admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@college.edu', password: 'Admin@123' });
    expect(adminRes.status).toBe(200);
    adminToken = adminRes.body.token;

    // Login as Student 1
    const studentRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student1@college.edu', password: 'Student@123' });
    expect(studentRes.status).toBe(200);
    student1Token = studentRes.body.token;
    student1Id = studentRes.body.user.id;

    // Get Languages
    const cLang = await ProgrammingLanguage.findOne({ slug: 'c' });
    const pyLang = await ProgrammingLanguage.findOne({ slug: 'python' });
    cLanguageId = cLang!._id.toString();
    pythonLanguageId = pyLang!._id.toString();

    // Get Exams
    const exam1 = await Examination.findOne({ languageId: cLang!._id, levelNumber: 1 });
    const exam2 = await Examination.findOne({ languageId: cLang!._id, levelNumber: 2 });
    cExamLevel1Id = exam1!._id.toString();
    cExamLevel2Id = exam2!._id.toString();

    // Select an available unfilled slot
    const slot1 = await ExaminationSlot.findOne({ examinationId: exam1!._id, $expr: { $lt: ['$registeredCount', '$capacity'] } });
    const slot2 = await ExaminationSlot.findOne({ examinationId: exam2!._id, $expr: { $lt: ['$registeredCount', '$capacity'] } });
    cSlotLevel1Id = slot1!._id.toString();
    cSlotLevel2Id = slot2!._id.toString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('1. Authentication & RBAC', () => {
    test('Valid login returns JWT and profile', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'student1@college.edu', password: 'Student@123' });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('student');
    });

    test('Invalid credentials rejected with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'student1@college.edu', password: 'WrongPassword' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('Disabled account login rejected with 403', async () => {
      const disabledUser = await User.create({
        email: 'disabled@college.edu',
        passwordHash: 'hash',
        role: 'student',
        firstName: 'Disabled',
        lastName: 'Account',
        isActive: false
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'disabled@college.edu', password: 'Any' });
      expect(res.status).toBe(403);
      await User.findByIdAndDelete(disabledUser._id);
    });

    test('Student cannot access admin routes (RBAC check)', async () => {
      const res = await request(app)
        .get('/api/admin/overview')
        .set('Authorization', `Bearer ${student1Token}`);
      expect(res.status).toBe(403);
    });

    test('Admin can access admin routes', async () => {
      const res = await request(app)
        .get('/api/admin/overview')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats.totalStudents).toBeGreaterThan(0);
    });
  });

  describe('2. Level Progression & Registration Rules', () => {
    test('Level 1 has no prerequisite and is eligible for registration', async () => {
      const eligibility = await ProgressionService.verifyEligibility(student1Id, cLanguageId, 1);
      expect(eligibility.isEligible).toBe(true);
    });

    test('Level 2 is locked before Level 1 is passed', async () => {
      const eligibility = await ProgressionService.verifyEligibility(student1Id, cLanguageId, 2);
      expect(eligibility.isEligible).toBe(false);
      expect(eligibility.reason).toContain('Level 2 is locked');
    });

    test('Attempting to register for locked Level 2 returns 403 Forbidden', async () => {
      const res = await request(app)
        .post(`/api/exams/${cExamLevel2Id}/register`)
        .set('Authorization', `Bearer ${student1Token}`)
        .send({ slotId: cSlotLevel2Id });
      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Level 2 is locked');
    });

    test('Student successfully registers for Level 1 examination slot', async () => {
      const res = await request(app)
        .post(`/api/exams/${cExamLevel1Id}/register`)
        .set('Authorization', `Bearer ${student1Token}`)
        .send({ slotId: cSlotLevel1Id });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test('Duplicate registration for same exam is rejected', async () => {
      const res = await request(app)
        .post(`/api/exams/${cExamLevel1Id}/register`)
        .set('Authorization', `Bearer ${student1Token}`)
        .send({ slotId: cSlotLevel1Id });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already registered');
    });

    test('Filled slot (30/30) is rejected and not returned in real-time available slots', async () => {
      // Find the completely filled slot from seed (registeredCount = 30)
      const filledSlot = await ExaminationSlot.findOne({
        examinationId: cExamLevel1Id,
        registeredCount: { $gte: 30 }
      });
      expect(filledSlot).toBeDefined();

      // Student 2 (not yet registered) tries to register for this filled slot
      const student2Res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'student2@college.edu', password: 'Student@123' });
      const student2Token = student2Res.body.token;

      const regRes = await request(app)
        .post(`/api/exams/${cExamLevel1Id}/register`)
        .set('Authorization', `Bearer ${student2Token}`)
        .send({ slotId: filledSlot!._id.toString() });
      expect(regRes.status).toBe(400);
      expect(regRes.body.message).toContain('filled');

      // Check available exams list: the filled slot must NOT be in the returned slots list
      const availRes = await request(app)
        .get('/api/exams/available')
        .set('Authorization', `Bearer ${student2Token}`);
      const cExam = availRes.body.exams.find((e: any) => e.id === cExamLevel1Id);
      const slotIds = cExam.slots.map((s: any) => s._id);
      expect(slotIds).not.toContain(filledSlot!._id.toString());
    });

    test('Exam whose registration opens at previous day 9:00 PM rejects early registration', async () => {
      // Find the upcoming future exam
      const futureExam = await Examination.findOne({ title: /Future Exam/ });
      expect(futureExam).toBeDefined();

      const student2Res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'student2@college.edu', password: 'Student@123' });
      const student2Token = student2Res.body.token;

      // Find any slot of future exam
      const slot = await ExaminationSlot.findOne({ examinationId: futureExam!._id });

      const regRes = await request(app)
        .post(`/api/exams/${futureExam!._id}/register`)
        .set('Authorization', `Bearer ${student2Token}`)
        .send({ slotId: slot!._id.toString() });

      expect(regRes.status).toBe(400);
      expect(regRes.body.message).toContain('previous day at 9:00 PM');
    });

    test('Starting Level 1 exam creates authoritative session with deadline', async () => {
      const res = await request(app)
        .post(`/api/exams/${cExamLevel1Id}/start-session`)
        .set('Authorization', `Bearer ${student1Token}`);
      expect(res.status).toBe(201);
      expect(res.body.sessionId).toBeDefined();
      expect(res.body.deadline).toBeDefined();

      const sessionId = res.body.sessionId;

      // Check session questions do NOT expose hidden test cases
      const sessionData = await request(app)
        .get(`/api/exams/session/${sessionId}`)
        .set('Authorization', `Bearer ${student1Token}`);
      expect(sessionData.status).toBe(200);

      const q1 = sessionData.body.questions[0];
      expect(q1.publicTestCases).toBeDefined();
      // Ensure all returned test cases have isHidden === false
      q1.publicTestCases.forEach((tc: any) => {
        expect(tc.isHidden).toBe(false);
      });
    });

    test('Failing exam does NOT unlock Level 2', async () => {
      const progBefore = await StudentProgress.findOne({ studentId: student1Id, languageId: cLanguageId });
      expect(progBefore!.highestUnlockedLevel).toBe(1);

      // Simulate a failing session finalization
      const mockSession = await mongoose.model('ExaminationSession').create({
        examinationId: cExamLevel1Id,
        slotId: cSlotLevel1Id,
        studentId: student1Id,
        startedAt: new Date(),
        deadline: new Date(Date.now() + 3600000),
        status: 'active'
      });

      // Submit failing answer (score = 0)
      const q = await mongoose.model('Question').findOne({ targetLevel: 1 });
      await mongoose.model('Submission').create({
        sessionId: mockSession._id,
        examinationId: cExamLevel1Id,
        studentId: student1Id,
        questionId: q!._id,
        language: 'c',
        code: 'int main(){ return 0; }',
        verdict: 'Wrong Answer',
        score: 0,
        maxScore: 100,
        testCaseResults: []
      });

      const { result, unlockedNextLevel } = await ProgressionService.finalizeExamSession(mockSession._id.toString());
      expect(result.passed).toBe(false);
      expect(unlockedNextLevel).toBe(false);

      const progAfter = await StudentProgress.findOne({ studentId: student1Id, languageId: cLanguageId });
      expect(progAfter!.highestUnlockedLevel).toBe(1);
    });

    test('Passing Level 1 unlocks Level 2 for C, but leaves Python Level 2 locked', async () => {
      const mockPassingSession = await mongoose.model('ExaminationSession').create({
        examinationId: cExamLevel1Id,
        slotId: cSlotLevel1Id,
        studentId: student1Id,
        startedAt: new Date(),
        deadline: new Date(Date.now() + 3600000),
        status: 'active'
      });

      const exam = await mongoose.model('Examination').findById(cExamLevel1Id);
      for (const qId of exam!.questions) {
        await mongoose.model('Submission').create({
          sessionId: mockPassingSession._id,
          examinationId: cExamLevel1Id,
          studentId: student1Id,
          questionId: qId,
          language: 'c',
          code: '#include <stdio.h>\nint main(){ return 0; }',
          verdict: 'Accepted',
          score: 100,
          maxScore: 100,
          testCaseResults: []
        });
      }

      const { result, unlockedNextLevel, nextLevelNumber } = await ProgressionService.finalizeExamSession(
        mockPassingSession._id.toString()
      );
      expect(result.passed).toBe(true);
      expect(unlockedNextLevel).toBe(true);
      expect(nextLevelNumber).toBe(2);

      // C Level 2 is now unlocked!
      const cEligibility = await ProgressionService.verifyEligibility(student1Id, cLanguageId, 2);
      expect(cEligibility.isEligible).toBe(true);

      // Crucial requirement: C progression must NOT unlock Python progression!
      const pyEligibility = await ProgressionService.verifyEligibility(student1Id, pythonLanguageId, 2);
      expect(pyEligibility.isEligible).toBe(false);
    });

    test('Duplicate result processing cannot duplicate unlocked levels (Idempotency)', async () => {
      const cProg = await StudentProgress.findOne({ studentId: student1Id, languageId: cLanguageId });
      expect(cProg!.highestUnlockedLevel).toBe(2);

      // Find the previous passed session and call finalize again
      const passedResult = await mongoose.model('ExaminationResult').findOne({ studentId: student1Id, passed: true });
      const secondCall = await ProgressionService.finalizeExamSession(passedResult!.sessionId.toString());

      expect(secondCall.unlockedNextLevel).toBe(false);
      const cProgAfter = await StudentProgress.findOne({ studentId: student1Id, languageId: cLanguageId });
      expect(cProgAfter!.highestUnlockedLevel).toBe(2);
    });
  });
});
