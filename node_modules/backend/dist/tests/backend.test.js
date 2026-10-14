"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../index"));
const User_1 = require("../models/User");
const ProgrammingLanguage_1 = require("../models/ProgrammingLanguage");
const Examination_1 = require("../models/Examination");
const ExaminationSlot_1 = require("../models/ExaminationSlot");
const StudentProgress_1 = require("../models/StudentProgress");
const ProgressionService_1 = require("../services/ProgressionService");
const seed_1 = require("../scripts/seed");
describe('College Programming Assessment Portal - Backend Test Suite', () => {
    let adminToken;
    let student1Token;
    let student1Id;
    let cLanguageId;
    let pythonLanguageId;
    let cExamLevel1Id;
    let cExamLevel2Id;
    let cSlotLevel1Id;
    let cSlotLevel2Id;
    beforeAll(async () => {
        // Seed test database
        await (0, seed_1.runSeed)();
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college_assessment_db');
        // Login as Admin
        const adminRes = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/login')
            .send({ email: 'admin@college.edu', password: 'Admin@123' });
        expect(adminRes.status).toBe(200);
        adminToken = adminRes.body.token;
        // Login as Student 1
        const studentRes = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/login')
            .send({ email: 'student1@college.edu', password: 'Student@123' });
        expect(studentRes.status).toBe(200);
        student1Token = studentRes.body.token;
        student1Id = studentRes.body.user.id;
        // Get Languages
        const cLang = await ProgrammingLanguage_1.ProgrammingLanguage.findOne({ slug: 'c' });
        const pyLang = await ProgrammingLanguage_1.ProgrammingLanguage.findOne({ slug: 'python' });
        cLanguageId = cLang._id.toString();
        pythonLanguageId = pyLang._id.toString();
        // Get Exams
        const exam1 = await Examination_1.Examination.findOne({ languageId: cLang._id, levelNumber: 1 });
        const exam2 = await Examination_1.Examination.findOne({ languageId: cLang._id, levelNumber: 2 });
        cExamLevel1Id = exam1._id.toString();
        cExamLevel2Id = exam2._id.toString();
        const slot1 = await ExaminationSlot_1.ExaminationSlot.findOne({ examinationId: exam1._id });
        const slot2 = await ExaminationSlot_1.ExaminationSlot.findOne({ examinationId: exam2._id });
        cSlotLevel1Id = slot1._id.toString();
        cSlotLevel2Id = slot2._id.toString();
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
    });
    describe('1. Authentication & RBAC', () => {
        test('Valid login returns JWT and profile', async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .post('/api/auth/login')
                .send({ email: 'student1@college.edu', password: 'Student@123' });
            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.user.role).toBe('student');
        });
        test('Invalid credentials rejected with 401', async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .post('/api/auth/login')
                .send({ email: 'student1@college.edu', password: 'WrongPassword' });
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
        test('Disabled account login rejected with 403', async () => {
            const disabledUser = await User_1.User.create({
                email: 'disabled@college.edu',
                passwordHash: 'hash',
                role: 'student',
                firstName: 'Disabled',
                lastName: 'Account',
                isActive: false
            });
            const res = await (0, supertest_1.default)(index_1.default)
                .post('/api/auth/login')
                .send({ email: 'disabled@college.edu', password: 'Any' });
            expect(res.status).toBe(403);
            await User_1.User.findByIdAndDelete(disabledUser._id);
        });
        test('Student cannot access admin routes (RBAC check)', async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .get('/api/admin/overview')
                .set('Authorization', `Bearer ${student1Token}`);
            expect(res.status).toBe(403);
        });
        test('Admin can access admin routes', async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .get('/api/admin/overview')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.stats.totalStudents).toBeGreaterThan(0);
        });
    });
    describe('2. Level Progression & Registration Rules', () => {
        test('Level 1 has no prerequisite and is eligible for registration', async () => {
            const eligibility = await ProgressionService_1.ProgressionService.verifyEligibility(student1Id, cLanguageId, 1);
            expect(eligibility.isEligible).toBe(true);
        });
        test('Level 2 is locked before Level 1 is passed', async () => {
            const eligibility = await ProgressionService_1.ProgressionService.verifyEligibility(student1Id, cLanguageId, 2);
            expect(eligibility.isEligible).toBe(false);
            expect(eligibility.reason).toContain('Level 2 is locked');
        });
        test('Attempting to register for locked Level 2 returns 403 Forbidden', async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .post(`/api/exams/${cExamLevel2Id}/register`)
                .set('Authorization', `Bearer ${student1Token}`)
                .send({ slotId: cSlotLevel2Id });
            expect(res.status).toBe(403);
            expect(res.body.message).toContain('Level 2 is locked');
        });
        test('Student successfully registers for Level 1 examination slot', async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .post(`/api/exams/${cExamLevel1Id}/register`)
                .set('Authorization', `Bearer ${student1Token}`)
                .send({ slotId: cSlotLevel1Id });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });
        test('Duplicate registration for same exam is rejected', async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .post(`/api/exams/${cExamLevel1Id}/register`)
                .set('Authorization', `Bearer ${student1Token}`)
                .send({ slotId: cSlotLevel1Id });
            expect(res.status).toBe(400);
            expect(res.body.message).toContain('already registered');
        });
        test('Starting Level 1 exam creates authoritative session with deadline', async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .post(`/api/exams/${cExamLevel1Id}/start-session`)
                .set('Authorization', `Bearer ${student1Token}`);
            expect(res.status).toBe(201);
            expect(res.body.sessionId).toBeDefined();
            expect(res.body.deadline).toBeDefined();
            const sessionId = res.body.sessionId;
            // Check session questions do NOT expose hidden test cases
            const sessionData = await (0, supertest_1.default)(index_1.default)
                .get(`/api/exams/session/${sessionId}`)
                .set('Authorization', `Bearer ${student1Token}`);
            expect(sessionData.status).toBe(200);
            const q1 = sessionData.body.questions[0];
            expect(q1.publicTestCases).toBeDefined();
            // Ensure all returned test cases have isHidden === false
            q1.publicTestCases.forEach((tc) => {
                expect(tc.isHidden).toBe(false);
            });
        });
        test('Failing exam does NOT unlock Level 2', async () => {
            const progBefore = await StudentProgress_1.StudentProgress.findOne({ studentId: student1Id, languageId: cLanguageId });
            expect(progBefore.highestUnlockedLevel).toBe(1);
            // Simulate a failing session finalization
            const mockSession = await mongoose_1.default.model('ExaminationSession').create({
                examinationId: cExamLevel1Id,
                slotId: cSlotLevel1Id,
                studentId: student1Id,
                startedAt: new Date(),
                deadline: new Date(Date.now() + 3600000),
                status: 'active'
            });
            // Submit failing answer (score = 0)
            const q = await mongoose_1.default.model('Question').findOne({ targetLevel: 1 });
            await mongoose_1.default.model('Submission').create({
                sessionId: mockSession._id,
                examinationId: cExamLevel1Id,
                studentId: student1Id,
                questionId: q._id,
                language: 'c',
                code: 'int main(){ return 0; }',
                verdict: 'Wrong Answer',
                score: 0,
                maxScore: 100,
                testCaseResults: []
            });
            const { result, unlockedNextLevel } = await ProgressionService_1.ProgressionService.finalizeExamSession(mockSession._id.toString());
            expect(result.passed).toBe(false);
            expect(unlockedNextLevel).toBe(false);
            const progAfter = await StudentProgress_1.StudentProgress.findOne({ studentId: student1Id, languageId: cLanguageId });
            expect(progAfter.highestUnlockedLevel).toBe(1);
        });
        test('Passing Level 1 unlocks Level 2 for C, but leaves Python Level 2 locked', async () => {
            const mockPassingSession = await mongoose_1.default.model('ExaminationSession').create({
                examinationId: cExamLevel1Id,
                slotId: cSlotLevel1Id,
                studentId: student1Id,
                startedAt: new Date(),
                deadline: new Date(Date.now() + 3600000),
                status: 'active'
            });
            const exam = await mongoose_1.default.model('Examination').findById(cExamLevel1Id);
            for (const qId of exam.questions) {
                await mongoose_1.default.model('Submission').create({
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
            const { result, unlockedNextLevel, nextLevelNumber } = await ProgressionService_1.ProgressionService.finalizeExamSession(mockPassingSession._id.toString());
            expect(result.passed).toBe(true);
            expect(unlockedNextLevel).toBe(true);
            expect(nextLevelNumber).toBe(2);
            // C Level 2 is now unlocked!
            const cEligibility = await ProgressionService_1.ProgressionService.verifyEligibility(student1Id, cLanguageId, 2);
            expect(cEligibility.isEligible).toBe(true);
            // Crucial requirement: C progression must NOT unlock Python progression!
            const pyEligibility = await ProgressionService_1.ProgressionService.verifyEligibility(student1Id, pythonLanguageId, 2);
            expect(pyEligibility.isEligible).toBe(false);
        });
        test('Duplicate result processing cannot duplicate unlocked levels (Idempotency)', async () => {
            const cProg = await StudentProgress_1.StudentProgress.findOne({ studentId: student1Id, languageId: cLanguageId });
            expect(cProg.highestUnlockedLevel).toBe(2);
            // Find the previous passed session and call finalize again
            const passedResult = await mongoose_1.default.model('ExaminationResult').findOne({ studentId: student1Id, passed: true });
            const secondCall = await ProgressionService_1.ProgressionService.finalizeExamSession(passedResult.sessionId.toString());
            expect(secondCall.unlockedNextLevel).toBe(false);
            const cProgAfter = await StudentProgress_1.StudentProgress.findOne({ studentId: student1Id, languageId: cLanguageId });
            expect(cProgAfter.highestUnlockedLevel).toBe(2);
        });
    });
});
