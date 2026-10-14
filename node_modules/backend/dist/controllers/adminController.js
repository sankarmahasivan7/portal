"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverviewStats = getOverviewStats;
exports.getStudents = getStudents;
exports.createStudent = createStudent;
exports.toggleStudentStatus = toggleStudentStatus;
exports.resetStudentPassword = resetStudentPassword;
exports.importStudentsCsv = importStudentsCsv;
exports.exportStudentsCsv = exportStudentsCsv;
exports.getLanguages = getLanguages;
exports.createLanguage = createLanguage;
exports.updateLanguage = updateLanguage;
exports.getQuestions = getQuestions;
exports.createQuestion = createQuestion;
exports.updateQuestion = updateQuestion;
exports.deleteQuestion = deleteQuestion;
exports.getAdminExams = getAdminExams;
exports.createExam = createExam;
exports.togglePublishExam = togglePublishExam;
exports.addExamSlot = addExamSlot;
exports.getAdminResults = getAdminResults;
exports.exportResultsCsv = exportResultsCsv;
exports.getAuditLogs = getAuditLogs;
exports.getPlatformConfig = getPlatformConfig;
exports.updatePlatformConfig = updatePlatformConfig;
exports.downloadSebConfig = downloadSebConfig;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const StudentProfile_1 = require("../models/StudentProfile");
const ProgrammingLanguage_1 = require("../models/ProgrammingLanguage");
const ProgrammingLevel_1 = require("../models/ProgrammingLevel");
const Question_1 = require("../models/Question");
const TestCase_1 = require("../models/TestCase");
const Examination_1 = require("../models/Examination");
const ExaminationSlot_1 = require("../models/ExaminationSlot");
const ExaminationRegistration_1 = require("../models/ExaminationRegistration");
const ExaminationResult_1 = require("../models/ExaminationResult");
const Submission_1 = require("../models/Submission");
const AuditLog_1 = require("../models/AuditLog");
const PlatformConfiguration_1 = require("../models/PlatformConfiguration");
const ExecutionClient_1 = require("../services/ExecutionClient");
const AuditService_1 = require("../services/AuditService");
// OVERVIEW & METRICS
async function getOverviewStats(_req, res) {
    try {
        const [totalStudents, activeStudents, totalExams, publishedExams, totalSubmissions, totalResults, passedResults, failedResults, workerHealth] = await Promise.all([
            User_1.User.countDocuments({ role: 'student' }),
            User_1.User.countDocuments({ role: 'student', isActive: true }),
            Examination_1.Examination.countDocuments(),
            Examination_1.Examination.countDocuments({ isPublished: true }),
            Submission_1.Submission.countDocuments(),
            ExaminationResult_1.ExaminationResult.countDocuments(),
            ExaminationResult_1.ExaminationResult.countDocuments({ passed: true }),
            ExaminationResult_1.ExaminationResult.countDocuments({ passed: false }),
            (0, ExecutionClient_1.checkWorkerHealth)()
        ]);
        // Pass rate percentage
        const passPercentage = totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0;
        // Recent results breakdown
        const recentSubmissions = await Submission_1.Submission.find()
            .sort({ createdAt: -1 })
            .limit(8)
            .populate('studentId', 'firstName lastName email studentId')
            .populate('questionId', 'title');
        return res.json({
            success: true,
            stats: {
                totalStudents,
                activeStudents,
                totalExams,
                publishedExams,
                totalSubmissions,
                totalResults,
                passedResults,
                failedResults,
                passPercentage,
                workerHealth
            },
            recentSubmissions
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Overview stats error', error: error.message });
    }
}
// STUDENT MANAGEMENT
async function getStudents(req, res) {
    try {
        const { search, page = '1', limit = '50' } = req.query;
        const query = { role: 'student' };
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } }
            ];
        }
        const p = parseInt(page, 10);
        const l = parseInt(limit, 10);
        const [students, total] = await Promise.all([
            User_1.User.find(query).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
            User_1.User.countDocuments(query)
        ]);
        const studentIds = students.map((s) => s._id);
        const profiles = await StudentProfile_1.StudentProfile.find({ userId: { $in: studentIds } });
        const profileMap = new Map(profiles.map((pr) => [pr.userId.toString(), pr]));
        const enriched = students.map((s) => ({
            id: s._id,
            email: s.email,
            firstName: s.firstName,
            lastName: s.lastName,
            studentId: s.studentId,
            isActive: s.isActive,
            collegeIpExempt: s.collegeIpExempt,
            profile: profileMap.get(s._id.toString()),
            createdAt: s.createdAt
        }));
        return res.json({ success: true, students: enriched, total, page: p, totalPages: Math.ceil(total / l) });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error retrieving students', error: error.message });
    }
}
async function createStudent(req, res) {
    try {
        const { email, password, firstName, lastName, studentId, department, batch, enrollmentNumber } = req.body;
        const existing = await User_1.User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password || 'Student@123', 10);
        const user = await User_1.User.create({
            email: email.toLowerCase().trim(),
            passwordHash,
            role: 'student',
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            studentId: studentId?.trim(),
            isActive: true
        });
        const profile = await StudentProfile_1.StudentProfile.create({
            userId: user._id,
            studentId: studentId?.trim() || `STU-${user._id.toString().slice(-4)}`,
            department: department || 'Computer Science',
            batch: batch || '2022-2026',
            enrollmentNumber: enrollmentNumber || `ENR${user._id.toString().slice(-6)}`
        });
        await (0, AuditService_1.logAudit)('ADMIN_CREATED_STUDENT', { studentEmail: user.email, studentId: user.studentId }, req);
        return res.status(201).json({ success: true, student: { ...user.toObject(), profile } });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Student creation failed', error: error.message });
    }
}
async function toggleStudentStatus(req, res) {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const user = await User_1.User.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        await (0, AuditService_1.logAudit)('STUDENT_STATUS_UPDATED', { studentId: id, isActive }, req);
        return res.json({ success: true, student: user });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating student', error: error.message });
    }
}
async function resetStudentPassword(req, res) {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        const passwordHash = await bcryptjs_1.default.hash(newPassword || 'Reset@123', 10);
        const user = await User_1.User.findByIdAndUpdate(id, { passwordHash }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        await (0, AuditService_1.logAudit)('STUDENT_PASSWORD_RESET', { studentId: id }, req);
        return res.json({ success: true, message: 'Student password reset successfully.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Password reset failed', error: error.message });
    }
}
async function importStudentsCsv(req, res) {
    try {
        const { csvData } = req.body; // Array of student rows or raw CSV string
        if (!csvData) {
            return res.status(400).json({ success: false, message: 'No CSV data provided' });
        }
        let rows = [];
        if (typeof csvData === 'string') {
            const lines = csvData.trim().split('\n');
            const headers = lines[0].split(',').map((h) => h.trim());
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim())
                    continue;
                const vals = lines[i].split(',').map((v) => v.trim());
                const rowObj = {};
                headers.forEach((h, idx) => {
                    rowObj[h] = vals[idx] || '';
                });
                rows.push(rowObj);
            }
        }
        else if (Array.isArray(csvData)) {
            rows = csvData;
        }
        let importedCount = 0;
        let skippedCount = 0;
        for (const row of rows) {
            const email = (row.email || row.Email || '').toLowerCase().trim();
            if (!email)
                continue;
            const existing = await User_1.User.findOne({ email });
            if (existing) {
                skippedCount++;
                continue;
            }
            const passwordHash = await bcryptjs_1.default.hash(row.password || 'College@2026', 10);
            const user = await User_1.User.create({
                email,
                passwordHash,
                role: 'student',
                firstName: row.firstName || row.FirstName || 'Student',
                lastName: row.lastName || row.LastName || '',
                studentId: row.studentId || row.StudentId || `STU-${Date.now().toString().slice(-5)}`,
                isActive: true
            });
            await StudentProfile_1.StudentProfile.create({
                userId: user._id,
                studentId: user.studentId,
                department: row.department || row.Department || 'Computer Science',
                batch: row.batch || row.Batch || '2022-2026',
                enrollmentNumber: row.enrollmentNumber || row.EnrollmentNumber || `ENR${user._id.toString().slice(-6)}`
            });
            importedCount++;
        }
        await (0, AuditService_1.logAudit)('CSV_STUDENT_IMPORT', { importedCount, skippedCount }, req);
        return res.json({
            success: true,
            message: `Import completed: ${importedCount} created, ${skippedCount} skipped (duplicates).`,
            importedCount,
            skippedCount
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'CSV import error', error: error.message });
    }
}
async function exportStudentsCsv(_req, res) {
    try {
        const students = await User_1.User.find({ role: 'student' }).sort({ email: 1 });
        const profiles = await StudentProfile_1.StudentProfile.find();
        const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));
        let csv = 'Email,FirstName,LastName,StudentId,Department,Batch,EnrollmentNumber,Status\n';
        students.forEach((s) => {
            const pr = profileMap.get(s._id.toString());
            csv += `"${s.email}","${s.firstName}","${s.lastName}","${s.studentId || ''}","${pr?.department || ''}","${pr?.batch || ''}","${pr?.enrollmentNumber || ''}","${s.isActive ? 'Active' : 'Disabled'}"\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="students_export.csv"');
        return res.send(csv);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Export error', error: error.message });
    }
}
// PROGRAMMING LANGUAGE MANAGEMENT
async function getLanguages(_req, res) {
    try {
        const languages = await ProgrammingLanguage_1.ProgrammingLanguage.find().sort({ name: 1 });
        const health = await (0, ExecutionClient_1.checkWorkerHealth)();
        const languagesWithAvailability = languages.map((lang) => {
            const isAvailableInWorker = health.healthy && health.details?.compilers?.[lang.executionEngineId];
            return {
                ...lang.toObject(),
                isCompilerAvailable: !!isAvailableInWorker
            };
        });
        return res.json({ success: true, languages: languagesWithAvailability, workerHealth: health });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Language fetch error', error: error.message });
    }
}
async function createLanguage(req, res) {
    try {
        const { name, slug, executionEngineId, totalLevels, defaultTimeLimitMs, defaultMemoryLimitMb, templateCode } = req.body;
        // Check worker compiler support before allowing creation
        const health = await (0, ExecutionClient_1.checkWorkerHealth)();
        if (!health.details?.compilers?.[executionEngineId]) {
            return res.status(400).json({
                success: false,
                message: `Compiler or runtime for execution engine '${executionEngineId}' is not installed or available on the execution worker.`
            });
        }
        const language = await ProgrammingLanguage_1.ProgrammingLanguage.create({
            name,
            slug: slug.toLowerCase(),
            executionEngineId,
            totalLevels: totalLevels || 4,
            isEnabled: true,
            defaultTimeLimitMs: defaultTimeLimitMs || 4000,
            defaultMemoryLimitMb: defaultMemoryLimitMb || 256,
            templateCode: templateCode || ''
        });
        // Create levels
        for (let i = 1; i <= language.totalLevels; i++) {
            await ProgrammingLevel_1.ProgrammingLevel.create({
                languageId: language._id,
                levelNumber: i,
                title: `${name} Level ${i}`,
                description: `Curriculum and assessments for Level ${i}`,
                defaultPassingPercentage: 60,
                prerequisiteLevel: i === 1 ? null : i - 1
            });
        }
        await (0, AuditService_1.logAudit)('LANGUAGE_CREATED', { languageId: language._id, name }, req);
        return res.status(201).json({ success: true, language });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Language creation failed', error: error.message });
    }
}
async function updateLanguage(req, res) {
    try {
        const { id } = req.params;
        const { isEnabled, totalLevels, defaultTimeLimitMs, defaultMemoryLimitMb, templateCode } = req.body;
        const language = await ProgrammingLanguage_1.ProgrammingLanguage.findById(id);
        if (!language) {
            return res.status(404).json({ success: false, message: 'Language not found.' });
        }
        if (isEnabled === true) {
            const health = await (0, ExecutionClient_1.checkWorkerHealth)();
            if (!health.details?.compilers?.[language.executionEngineId]) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot enable language: Compiler/runtime for '${language.executionEngineId}' is not detected on the execution worker.`
                });
            }
        }
        if (isEnabled !== undefined)
            language.isEnabled = isEnabled;
        if (totalLevels !== undefined)
            language.totalLevels = totalLevels;
        if (defaultTimeLimitMs !== undefined)
            language.defaultTimeLimitMs = defaultTimeLimitMs;
        if (defaultMemoryLimitMb !== undefined)
            language.defaultMemoryLimitMb = defaultMemoryLimitMb;
        if (templateCode !== undefined)
            language.templateCode = templateCode;
        await language.save();
        await (0, AuditService_1.logAudit)('LANGUAGE_UPDATED', { languageId: id, isEnabled }, req);
        return res.json({ success: true, language });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Language update error', error: error.message });
    }
}
// QUESTION MANAGEMENT
async function getQuestions(req, res) {
    try {
        const { level, difficulty, search } = req.query;
        const query = { isArchived: false };
        if (level)
            query.targetLevel = parseInt(level, 10);
        if (difficulty)
            query.difficulty = difficulty;
        if (search)
            query.title = { $regex: search, $options: 'i' };
        const questions = await Question_1.Question.find(query).sort({ targetLevel: 1, createdAt: -1 });
        const qIds = questions.map((q) => q._id);
        const testCases = await TestCase_1.TestCase.find({ questionId: { $in: qIds } }).sort({ order: 1 });
        const tcMap = new Map();
        testCases.forEach((tc) => {
            const qId = tc.questionId.toString();
            if (!tcMap.has(qId))
                tcMap.set(qId, []);
            tcMap.get(qId).push(tc);
        });
        const enriched = questions.map((q) => ({
            ...q.toObject(),
            testCases: tcMap.get(q._id.toString()) || []
        }));
        return res.json({ success: true, questions: enriched });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error retrieving questions', error: error.message });
    }
}
async function createQuestion(req, res) {
    try {
        const { title, description, inputFormat, outputFormat, constraints, examples, allowedLanguages, targetLevel, difficulty, marks, testCases } = req.body;
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
        const question = await Question_1.Question.create({
            title,
            slug,
            description,
            inputFormat,
            outputFormat,
            constraints,
            examples: examples || [],
            allowedLanguages: allowedLanguages || ['c', 'cpp', 'java', 'python'],
            targetLevel: targetLevel || 1,
            difficulty: difficulty || 'Easy',
            marks: marks || 100,
            createdBy: req.userId
        });
        if (Array.isArray(testCases) && testCases.length > 0) {
            const tcDocs = testCases.map((tc, idx) => ({
                questionId: question._id,
                input: tc.input || '',
                expectedOutput: tc.expectedOutput || '',
                isHidden: tc.isHidden || false,
                weight: tc.weight || 1,
                order: idx
            }));
            await TestCase_1.TestCase.insertMany(tcDocs);
        }
        await (0, AuditService_1.logAudit)('QUESTION_CREATED', { questionId: question._id, title }, req);
        return res.status(201).json({ success: true, question });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Question creation failed', error: error.message });
    }
}
async function updateQuestion(req, res) {
    try {
        const { id } = req.params;
        const { testCases, ...updateFields } = req.body;
        const question = await Question_1.Question.findByIdAndUpdate(id, updateFields, { new: true });
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        if (Array.isArray(testCases)) {
            await TestCase_1.TestCase.deleteMany({ questionId: question._id });
            const tcDocs = testCases.map((tc, idx) => ({
                questionId: question._id,
                input: tc.input || '',
                expectedOutput: tc.expectedOutput || '',
                isHidden: tc.isHidden || false,
                weight: tc.weight || 1,
                order: idx
            }));
            await TestCase_1.TestCase.insertMany(tcDocs);
        }
        await (0, AuditService_1.logAudit)('QUESTION_UPDATED', { questionId: id }, req);
        return res.json({ success: true, question });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Question update failed', error: error.message });
    }
}
async function deleteQuestion(req, res) {
    try {
        const { id } = req.params;
        await Question_1.Question.findByIdAndUpdate(id, { isArchived: true });
        await (0, AuditService_1.logAudit)('QUESTION_ARCHIVED', { questionId: id }, req);
        return res.json({ success: true, message: 'Question archived.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Delete error', error: error.message });
    }
}
// EXAMINATION MANAGEMENT
async function getAdminExams(_req, res) {
    try {
        const exams = await Examination_1.Examination.find().populate('languageId').sort({ createdAt: -1 });
        const examIds = exams.map((e) => e._id);
        const slots = await ExaminationSlot_1.ExaminationSlot.find({ examinationId: { $in: examIds } });
        const registrations = await ExaminationRegistration_1.ExaminationRegistration.find({ examinationId: { $in: examIds } });
        const slotMap = new Map();
        slots.forEach((s) => {
            const eId = s.examinationId.toString();
            if (!slotMap.has(eId))
                slotMap.set(eId, []);
            slotMap.get(eId).push(s);
        });
        const regMap = new Map();
        registrations.forEach((r) => {
            const eId = r.examinationId.toString();
            regMap.set(eId, (regMap.get(eId) || 0) + 1);
        });
        const enriched = exams.map((e) => ({
            ...e.toObject(),
            slots: slotMap.get(e._id.toString()) || [],
            registeredCount: regMap.get(e._id.toString()) || 0
        }));
        return res.json({ success: true, exams: enriched });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Exams fetch error', error: error.message });
    }
}
async function createExam(req, res) {
    try {
        const { title, description, languageId, levelNumber, registrationStartDate, registrationEndDate, examDate, durationMinutes, maxStudents, passingPercentage, questions, allowedLanguages, instructions, isPublished, sebRequired, collegeNetworkOnly, slots } = req.body;
        const exam = await Examination_1.Examination.create({
            title,
            description,
            languageId,
            levelNumber: levelNumber || 1,
            registrationStartDate: new Date(registrationStartDate),
            registrationEndDate: new Date(registrationEndDate),
            examDate: new Date(examDate),
            durationMinutes: durationMinutes || 60,
            maxStudents: maxStudents || 100,
            passingPercentage: passingPercentage || 60,
            questions: questions || [],
            allowedLanguages: allowedLanguages || ['c', 'cpp', 'java', 'python'],
            instructions: instructions || 'Follow exam guidelines.',
            isPublished: isPublished !== undefined ? isPublished : false,
            sebRequired: !!sebRequired,
            collegeNetworkOnly: !!collegeNetworkOnly,
            createdBy: req.userId
        });
        // Create examination slots if provided
        if (Array.isArray(slots) && slots.length > 0) {
            const slotDocs = slots.map((s) => ({
                examinationId: exam._id,
                slotName: s.slotName || 'Main Slot',
                startTime: new Date(s.startTime || exam.examDate),
                endTime: new Date(s.endTime || new Date(new Date(exam.examDate).getTime() + exam.durationMinutes * 60000)),
                capacity: s.capacity || exam.maxStudents,
                registeredCount: 0,
                isActive: true
            }));
            await ExaminationSlot_1.ExaminationSlot.insertMany(slotDocs);
        }
        else {
            // Default single slot
            await ExaminationSlot_1.ExaminationSlot.create({
                examinationId: exam._id,
                slotName: 'General Session',
                startTime: exam.examDate,
                endTime: new Date(exam.examDate.getTime() + exam.durationMinutes * 60000),
                capacity: exam.maxStudents,
                registeredCount: 0,
                isActive: true
            });
        }
        await (0, AuditService_1.logAudit)('EXAMINATION_CREATED', { examId: exam._id, title }, req);
        return res.status(201).json({ success: true, exam });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Exam creation error', error: error.message });
    }
}
async function togglePublishExam(req, res) {
    try {
        const { id } = req.params;
        const { isPublished } = req.body;
        const exam = await Examination_1.Examination.findByIdAndUpdate(id, { isPublished }, { new: true });
        if (!exam) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }
        await (0, AuditService_1.logAudit)('EXAMINATION_PUBLISH_TOGGLED', { examId: id, isPublished }, req);
        return res.json({ success: true, exam });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Publish toggle failed', error: error.message });
    }
}
async function addExamSlot(req, res) {
    try {
        const { id: examinationId } = req.params;
        const { slotName, startTime, endTime, capacity } = req.body;
        const slot = await ExaminationSlot_1.ExaminationSlot.create({
            examinationId,
            slotName,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            capacity: capacity || 50,
            registeredCount: 0,
            isActive: true
        });
        await (0, AuditService_1.logAudit)('EXAM_SLOT_ADDED', { examinationId, slotId: slot._id }, req);
        return res.status(201).json({ success: true, slot });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to add slot', error: error.message });
    }
}
// RESULTS & REPORTS
async function getAdminResults(req, res) {
    try {
        const { level, languageId, passed } = req.query;
        const query = {};
        if (level)
            query.levelNumber = parseInt(level, 10);
        if (languageId)
            query.languageId = languageId;
        if (passed !== undefined)
            query.passed = passed === 'true';
        const results = await ExaminationResult_1.ExaminationResult.find(query)
            .populate('studentId', 'firstName lastName email studentId')
            .populate('examinationId', 'title levelNumber passingPercentage')
            .populate('languageId', 'name slug')
            .sort({ verifiedAt: -1 });
        return res.json({ success: true, results });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Results error', error: error.message });
    }
}
async function exportResultsCsv(_req, res) {
    try {
        const results = await ExaminationResult_1.ExaminationResult.find()
            .populate('studentId', 'firstName lastName email studentId')
            .populate('examinationId', 'title levelNumber')
            .populate('languageId', 'name')
            .sort({ verifiedAt: -1 });
        let csv = 'StudentEmail,StudentName,StudentID,Language,Level,MarksObtained,TotalMarks,Percentage,Verdict,VerifiedAt\n';
        results.forEach((r) => {
            const student = r.studentId;
            csv += `"${student?.email || ''}","${student?.firstName || ''} ${student?.lastName || ''}","${student?.studentId || ''}","${r.languageId?.name || ''}","${r.levelNumber}","${r.obtainedMarks}","${r.totalMarks}","${r.percentage}%","${r.passed ? 'PASSED' : 'FAILED'}","${new Date(r.verifiedAt).toISOString()}"\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="examination_results_export.csv"');
        return res.send(csv);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'CSV export error', error: error.message });
    }
}
// AUDIT & SECURITY CONFIGURATION
async function getAuditLogs(req, res) {
    try {
        const { action, limit = '100' } = req.query;
        const query = {};
        if (action)
            query.action = action;
        const logs = await AuditLog_1.AuditLog.find(query).sort({ timestamp: -1 }).limit(parseInt(limit, 10));
        return res.json({ success: true, logs });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Audit fetch error', error: error.message });
    }
}
async function getPlatformConfig(_req, res) {
    try {
        let config = await PlatformConfiguration_1.PlatformConfiguration.findOne({ key: 'global_config' });
        if (!config) {
            config = await PlatformConfiguration_1.PlatformConfiguration.create({
                key: 'global_config',
                collegeNetworkRanges: ['127.0.0.1', '::1', '10.0.0.0/8', '192.168.0.0/16'],
                sebEnforced: false,
                sebConfigKey: '',
                sebQuitPassword: 'CollegeExamQuit2026',
                defaultTimeZone: 'Asia/Kolkata',
                allowStudentSelfRegistration: true
            });
        }
        return res.json({ success: true, config });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Config fetch error', error: error.message });
    }
}
async function updatePlatformConfig(req, res) {
    try {
        const { collegeNetworkRanges, sebEnforced, sebConfigKey, sebQuitPassword, allowStudentSelfRegistration } = req.body;
        let config = await PlatformConfiguration_1.PlatformConfiguration.findOne({ key: 'global_config' });
        if (!config) {
            config = new PlatformConfiguration_1.PlatformConfiguration({ key: 'global_config' });
        }
        if (collegeNetworkRanges)
            config.collegeNetworkRanges = collegeNetworkRanges;
        if (sebEnforced !== undefined)
            config.sebEnforced = sebEnforced;
        if (sebConfigKey !== undefined)
            config.sebConfigKey = sebConfigKey;
        if (sebQuitPassword !== undefined)
            config.sebQuitPassword = sebQuitPassword;
        if (allowStudentSelfRegistration !== undefined)
            config.allowStudentSelfRegistration = allowStudentSelfRegistration;
        config.updatedBy = req.userId;
        await config.save();
        await (0, AuditService_1.logAudit)('PLATFORM_CONFIG_UPDATED', req.body, req);
        return res.json({ success: true, config });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Config update failed', error: error.message });
    }
}
async function downloadSebConfig(_req, res) {
    try {
        const config = await PlatformConfiguration_1.PlatformConfiguration.findOne({ key: 'global_config' });
        const quitPass = config?.sebQuitPassword || 'CollegeExamQuit2026';
        const sebXml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>originatorVersion</key>
  <string>SEB_Win_3.5.0</string>
  <key>startURL</key>
  <string>http://localhost:5173/student/dashboard</string>
  <key>sebServerURL</key>
  <string>http://localhost:5000/api</string>
  <key>hashedQuitPassword</key>
  <string>${Buffer.from(quitPass).toString('hex')}</string>
  <key>allowQuit</key>
  <true/>
  <key>browserWindowAllowReload</key>
  <true/>
  <key>allowPreferencesWindow</key>
  <false/>
</dict>
</plist>`;
        res.setHeader('Content-Type', 'application/seb');
        res.setHeader('Content-Disposition', 'attachment; filename="college_exam.seb"');
        return res.send(sebXml);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'SEB config generation error', error: error.message });
    }
}
