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
  let facultyToken: string;
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

    // Login as Faculty
    const facultyRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'faculty@college.edu', password: 'Faculty@123' });
    expect(facultyRes.status).toBe(200);
    facultyToken = facultyRes.body.token;

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

    test('Faculty can only access exams and attendance, not overview, students, or results', async () => {
      // Forbidden pages for faculty
      const overviewRes = await request(app)
        .get('/api/admin/overview')
        .set('Authorization', `Bearer ${facultyToken}`);
      expect(overviewRes.status).toBe(403);

      const studentsRes = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${facultyToken}`);
      expect(studentsRes.status).toBe(403);

      const resultsRes = await request(app)
        .get('/api/admin/results')
        .set('Authorization', `Bearer ${facultyToken}`);
      expect(resultsRes.status).toBe(403);

      // Allowed pages for faculty
      const examsRes = await request(app)
        .get('/api/admin/exams')
        .set('Authorization', `Bearer ${facultyToken}`);
      expect(examsRes.status).toBe(200);

      const attendanceRes = await request(app)
        .get('/api/admin/attendance')
        .set('Authorization', `Bearer ${facultyToken}`);
      expect(attendanceRes.status).toBe(200);
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

    test('Starting exam before staff marks present in lab is rejected with 403', async () => {
      const res = await request(app)
        .post(`/api/exams/${cExamLevel1Id}/start-session`)
        .set('Authorization', `Bearer ${student1Token}`);
      expect(res.status).toBe(403);
      expect(res.body.attendancePending).toBe(true);
      expect(res.body.message).toContain('Attendance verification required');
    });

    test('Staff views slot attendance list and marks student present', async () => {
      // 1. Staff views attendance list
      const listRes = await request(app)
        .get(`/api/admin/exams/${cExamLevel1Id}/slots/${cSlotLevel1Id}/attendance`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(listRes.status).toBe(200);
      expect(listRes.body.success).toBe(true);
      expect(listRes.body.summary.totalRegistered).toBeGreaterThan(0);
      const student1Record = listRes.body.students.find((s: any) => s.student._id === student1Id);
      expect(student1Record).toBeDefined();
      expect(student1Record.attendanceStatus).toBe('pending');

      // 2. Staff marks student present
      const markRes = await request(app)
        .post(`/api/admin/exams/${cExamLevel1Id}/slots/${cSlotLevel1Id}/attendance`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ studentId: student1Id, status: 'present' });
      expect(markRes.status).toBe(200);
      expect(markRes.body.success).toBe(true);
      expect(markRes.body.registration.attendanceStatus).toBe('present');

      // 3. Student can poll attendance-status endpoint
      const pollRes = await request(app)
        .get(`/api/exams/${cExamLevel1Id}/attendance-status`)
        .set('Authorization', `Bearer ${student1Token}`);
      expect(pollRes.status).toBe(200);
      expect(pollRes.body.hasRegistration).toBe(true);
      expect(pollRes.body.attendanceStatus).toBe('present');
    });

    test('Starting Level 1 exam creates authoritative session once marked present', async () => {
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

  describe('3. Exam Failure Auto-Removal & Absent Course Admin Clearance', () => {
    test('Failing exam automatically removes course level from My Courses and allows re-registration', async () => {
      // 1. Enroll Student 2 in C Level 1
      const enrollRes = await request(app)
        .post('/api/student/course/c/register')
        .set('Authorization', `Bearer ${student1Token}`)
        .send({ levelNumber: 1 });
      expect([200, 400]).toContain(enrollRes.status);

      // Verify level 1 in enrolledLevels
      const prog = await StudentProgress.findOne({ studentId: student1Id, languageId: cLanguageId });
      prog!.enrolledLevels = [1];
      await prog!.save();

      // Create a mock failed session for student 1
      const mockFailSession = await mongoose.model('ExaminationSession').create({
        examinationId: cExamLevel1Id,
        slotId: cSlotLevel1Id,
        studentId: student1Id,
        startedAt: new Date(),
        deadline: new Date(Date.now() + 3600000),
        status: 'active'
      });

      // Finalize session with 0 score (failed)
      const { result } = await ProgressionService.finalizeExamSession(mockFailSession._id.toString());
      expect(result.passed).toBe(false);

      // Verify level 1 was automatically removed from enrolledLevels
      const progAfterFail = await StudentProgress.findOne({ studentId: student1Id, languageId: cLanguageId });
      expect(progAfterFail!.enrolledLevels.includes(1)).toBe(false);

      // Verify student can now re-register for Level 1 in Total Courses
      const reRegisterRes = await request(app)
        .post('/api/student/course/c/register')
        .set('Authorization', `Bearer ${student1Token}`)
        .send({ levelNumber: 1 });
      expect(reRegisterRes.status).toBe(200);
      expect(reRegisterRes.body.success).toBe(true);
    });

    test('Absent student remains in My Courses and cannot re-register until admin clears it', async () => {
      // Create absent registration
      const absentReg = await mongoose.model('ExaminationRegistration').create({
        examinationId: cExamLevel1Id,
        slotId: cSlotLevel1Id,
        studentId: student1Id,
        status: 'registered',
        attendanceStatus: 'absent'
      });

      // Verify student cannot re-register while marked absent
      const blockRes = await request(app)
        .post('/api/student/course/c/register')
        .set('Authorization', `Bearer ${student1Token}`)
        .send({ levelNumber: 1 });
      expect(blockRes.status).toBe(400);
      expect(blockRes.body.message).toContain('absent');

      // Admin removes absent course from student's My Courses
      const adminClearRes = await request(app)
        .post('/api/admin/attendance/remove-absent-course')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ registrationId: absentReg._id.toString() });
      expect(adminClearRes.status).toBe(200);
      expect(adminClearRes.body.success).toBe(true);

      // Absent registration is deleted
      const checkReg = await mongoose.model('ExaminationRegistration').findById(absentReg._id);
      expect(checkReg).toBeNull();

      // Student can now re-register in Total Courses
      const reEnrollRes = await request(app)
        .post('/api/student/course/c/register')
        .set('Authorization', `Bearer ${student1Token}`)
        .send({ levelNumber: 1 });
      expect(reEnrollRes.status).toBe(200);
      expect(reEnrollRes.body.success).toBe(true);
    });

    test('Completed level is removed from My Courses: only ongoing course levels appear', async () => {
      // Ensure student has Level 1 in completedLevels
      const prog = await StudentProgress.findOne({ studentId: student1Id, languageId: cLanguageId });
      expect(prog!.completedLevels.some((c) => c.levelNumber === 1)).toBe(true);

      // Register for Level 2 (ongoing)
      await request(app)
        .post('/api/student/course/c/register')
        .set('Authorization', `Bearer ${student1Token}`)
        .send({ levelNumber: 2 });

      // Call getMyCourses
      const myCoursesRes = await request(app)
        .get('/api/student/my-courses')
        .set('Authorization', `Bearer ${student1Token}`);

      expect(myCoursesRes.status).toBe(200);
      const cCourse = myCoursesRes.body.courses.find((c: any) => c.languageId === cLanguageId);
      expect(cCourse).toBeDefined();

      // Crucial requirement: Level 1 (Completed/Passed) MUST NOT appear in My Courses!
      const hasCompletedLevel1 = cCourse.levels.some((l: any) => l.levelNumber === 1);
      expect(hasCompletedLevel1).toBe(false);

      // Level 2 (Ongoing) MUST appear in My Courses!
      const hasOngoingLevel2 = cCourse.levels.some((l: any) => l.levelNumber === 2);
      expect(hasOngoingLevel2).toBe(true);
    });
  });
});
