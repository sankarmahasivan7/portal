import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { ProgrammingLanguage } from '../models/ProgrammingLanguage';
import { ProgrammingLevel } from '../models/ProgrammingLevel';
import { Question } from '../models/Question';
import { TestCase } from '../models/TestCase';
import { Examination } from '../models/Examination';
import { ExaminationSlot } from '../models/ExaminationSlot';
import { ExaminationRegistration } from '../models/ExaminationRegistration';
import { ExaminationResult } from '../models/ExaminationResult';
import { Submission } from '../models/Submission';
import { Notification } from '../models/Notification';
import { AuditLog } from '../models/AuditLog';
import { PlatformConfiguration } from '../models/PlatformConfiguration';
import { StudentProgress } from '../models/StudentProgress';
import { ExaminationSession } from '../models/ExaminationSession';
import { SubmissionOtp } from '../models/SubmissionOtp';
import { checkWorkerHealth } from '../services/ExecutionClient';
import { logAudit } from '../services/AuditService';
import { parseCollegeEmail, ALL_COLLEGE_DEPARTMENTS } from '../utils/collegeEmail';

// OVERVIEW & METRICS
export async function getOverviewStats(_req: AuthRequest, res: Response) {
  try {
    const [
      totalStudents,
      activeStudents,
      totalExams,
      publishedExams,
      totalSubmissions,
      totalResults,
      passedResults,
      failedResults,
      workerHealth
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'student', isActive: true }),
      Examination.countDocuments(),
      Examination.countDocuments({ isPublished: true }),
      Submission.countDocuments(),
      ExaminationResult.countDocuments(),
      ExaminationResult.countDocuments({ passed: true }),
      ExaminationResult.countDocuments({ passed: false }),
      checkWorkerHealth()
    ]);

    // Pass rate percentage
    const passPercentage = totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0;

    // Recent results breakdown
    const recentSubmissions = await Submission.find()
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Overview stats error', error: error.message });
  }
}

// STUDENT MANAGEMENT
export async function getStudents(req: AuthRequest, res: Response) {
  try {
    const { search, page = '1', limit = '50' } = req.query;
    const query: any = { role: 'student' };

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const p = parseInt(page as string, 10);
    const l = parseInt(limit as string, 10);

    const [students, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
      User.countDocuments(query)
    ]);

    const studentIds = students.map((s) => s._id);
    const profiles = await StudentProfile.find({ userId: { $in: studentIds } });
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error retrieving students', error: error.message });
  }
}

export async function createStudent(req: AuthRequest, res: Response) {
  try {
    const { email, password, firstName, lastName, studentId, department, batch, enrollmentNumber } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password || 'Student@123', 10);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'student',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      studentId: studentId?.trim(),
      isActive: true
    });

    const profile = await StudentProfile.create({
      userId: user._id,
      studentId: studentId?.trim() || `STU-${user._id.toString().slice(-4)}`,
      department: department || 'Computer Science',
      batch: batch || '2022-2026',
      enrollmentNumber: enrollmentNumber || `ENR${user._id.toString().slice(-6)}`
    });

    await logAudit('ADMIN_CREATED_STUDENT', { studentEmail: user.email, studentId: user.studentId }, req);

    return res.status(201).json({ success: true, student: { ...user.toObject(), profile } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Student creation failed', error: error.message });
  }
}

export async function toggleStudentStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    await logAudit('STUDENT_STATUS_UPDATED', { studentId: id, isActive }, req);
    return res.json({ success: true, student: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error updating student', error: error.message });
  }
}

export async function resetStudentPassword(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const passwordHash = await bcrypt.hash(newPassword || 'Reset@123', 10);

    const user = await User.findByIdAndUpdate(id, { passwordHash }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    await logAudit('STUDENT_PASSWORD_RESET', { studentId: id }, req);
    return res.json({ success: true, message: 'Student password reset successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Password reset failed', error: error.message });
  }
}

export async function importStudentsCsv(req: AuthRequest, res: Response) {
  try {
    const { csvData } = req.body; // Array of student rows or raw CSV string
    if (!csvData) {
      return res.status(400).json({ success: false, message: 'No CSV data provided' });
    }

    let rows: any[] = [];
    if (typeof csvData === 'string') {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map((h) => h.trim());
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const vals = lines[i].split(',').map((v) => v.trim());
        const rowObj: any = {};
        headers.forEach((h, idx) => {
          rowObj[h] = vals[idx] || '';
        });
        rows.push(rowObj);
      }
    } else if (Array.isArray(csvData)) {
      rows = csvData;
    }

    let importedCount = 0;
    let skippedCount = 0;

    for (const row of rows) {
      const email = (row.email || row.Email || '').toLowerCase().trim();
      if (!email) continue;

      const existing = await User.findOne({ email });
      if (existing) {
        skippedCount++;
        continue;
      }

      const passwordHash = await bcrypt.hash(row.password || 'College@2026', 10);
      const user = await User.create({
        email,
        passwordHash,
        role: 'student',
        firstName: row.firstName || row.FirstName || 'Student',
        lastName: row.lastName || row.LastName || '',
        studentId: row.studentId || row.StudentId || `STU-${Date.now().toString().slice(-5)}`,
        isActive: true
      });

      await StudentProfile.create({
        userId: user._id,
        studentId: user.studentId!,
        department: row.department || row.Department || 'Computer Science',
        batch: row.batch || row.Batch || '2022-2026',
        enrollmentNumber: row.enrollmentNumber || row.EnrollmentNumber || `ENR${user._id.toString().slice(-6)}`
      });

      importedCount++;
    }

    await logAudit('CSV_STUDENT_IMPORT', { importedCount, skippedCount }, req);

    return res.json({
      success: true,
      message: `Import completed: ${importedCount} created, ${skippedCount} skipped (duplicates).`,
      importedCount,
      skippedCount
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'CSV import error', error: error.message });
  }
}

export async function exportStudentsCsv(_req: AuthRequest, res: Response) {
  try {
    const students = await User.find({ role: 'student' }).sort({ email: 1 });
    const profiles = await StudentProfile.find();
    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

    let csv = 'Email,FirstName,LastName,StudentId,Department,Batch,EnrollmentNumber,Status\n';
    students.forEach((s) => {
      const pr = profileMap.get(s._id.toString());
      csv += `"${s.email}","${s.firstName}","${s.lastName}","${s.studentId || ''}","${pr?.department || ''}","${pr?.batch || ''}","${pr?.enrollmentNumber || ''}","${s.isActive ? 'Active' : 'Disabled'}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="students_export.csv"');
    return res.send(csv);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Export error', error: error.message });
  }
}

// PROGRAMMING LANGUAGE MANAGEMENT
export async function getLanguages(_req: AuthRequest, res: Response) {
  try {
    const languages = await ProgrammingLanguage.find().sort({ name: 1 });
    const health = await checkWorkerHealth();

    const languagesWithAvailability = languages.map((lang) => {
      const isAvailableInWorker = health.healthy && health.details?.compilers?.[lang.executionEngineId];
      return {
        ...lang.toObject(),
        isCompilerAvailable: !!isAvailableInWorker
      };
    });

    return res.json({ success: true, languages: languagesWithAvailability, workerHealth: health });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Language fetch error', error: error.message });
  }
}

export async function createLanguage(req: AuthRequest, res: Response) {
  try {
    const {
      name,
      slug,
      executionEngineId,
      totalLevels,
      defaultTimeLimitMs,
      defaultMemoryLimitMb,
      templateCode,
      description
    } = req.body;

    // Check worker compiler support before allowing creation
    const health = await checkWorkerHealth();
    if (health.healthy && health.details?.compilers && !health.details.compilers[executionEngineId]) {
      return res.status(400).json({
        success: false,
        message: `Compiler or runtime for execution engine '${executionEngineId}' is not installed or available on the execution worker.`
      });
    }

    const generatedSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const language = await ProgrammingLanguage.create({
      name,
      slug: generatedSlug,
      executionEngineId: executionEngineId || 'c',
      totalLevels: Number(totalLevels) || 4,
      isEnabled: true,
      defaultTimeLimitMs: Number(defaultTimeLimitMs) || 4000,
      defaultMemoryLimitMb: Number(defaultMemoryLimitMb) || 256,
      templateCode: templateCode || '',
      description: description || `Comprehensive training track and assessment curricula for ${name}.`
    });

    // Create levels
    for (let i = 1; i <= language.totalLevels; i++) {
      await ProgrammingLevel.create({
        languageId: language._id,
        levelNumber: i,
        title: `${name} Level ${i}`,
        description: `Curriculum and practical assessments for Level ${i}`,
        defaultPassingPercentage: 100,
        prerequisiteLevel: i === 1 ? null : i - 1
      });
    }

    await logAudit('COURSE_CREATED', { languageId: language._id, name }, req);
    return res.status(201).json({ success: true, language });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Course creation failed', error: error.message });
  }
}

export async function updateLanguage(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { name, isEnabled, totalLevels, defaultTimeLimitMs, defaultMemoryLimitMb, templateCode, description } = req.body;

    const language = await ProgrammingLanguage.findById(id);
    if (!language) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (isEnabled === true) {
      const health = await checkWorkerHealth();
      if (health.healthy && health.details?.compilers && !health.details.compilers[language.executionEngineId]) {
        return res.status(400).json({
          success: false,
          message: `Cannot enable course: Compiler/runtime for '${language.executionEngineId}' is not detected on the execution worker.`
        });
      }
    }

    if (name !== undefined) language.name = name;
    if (description !== undefined) language.description = description;
    if (isEnabled !== undefined) language.isEnabled = isEnabled;
    if (totalLevels !== undefined) language.totalLevels = Number(totalLevels);
    if (defaultTimeLimitMs !== undefined) language.defaultTimeLimitMs = Number(defaultTimeLimitMs);
    if (defaultMemoryLimitMb !== undefined) language.defaultMemoryLimitMb = Number(defaultMemoryLimitMb);
    if (templateCode !== undefined) language.templateCode = templateCode;

    await language.save();
    await logAudit('COURSE_UPDATED', { languageId: id, isEnabled, name: language.name }, req);

    return res.json({ success: true, language });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Course update error', error: error.message });
  }
}

export async function getLanguageCourseDetails(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const language = await ProgrammingLanguage.findById(id).lean();
    if (!language) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const levels = await ProgrammingLevel.find({ languageId: id }).sort({ levelNumber: 1 }).lean();

    const levelsWithStats = await Promise.all(
      levels.map(async (lvl) => {
        const questionCount = await Question.countDocuments({
          $or: [
            { languageId: id, targetLevel: lvl.levelNumber, isArchived: false },
            { targetLevel: lvl.levelNumber, isArchived: false, allowedLanguages: language.executionEngineId }
          ]
        });
        return {
          ...lvl,
          questionCount
        };
      })
    );

    return res.json({
      success: true,
      course: {
        ...language,
        levels: levelsWithStats
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error retrieving course details', error: error.message });
  }
}

export async function updateLanguageLevelDetails(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { levels } = req.body; // Array of { levelNumber, title, description }

    if (!Array.isArray(levels)) {
      return res.status(400).json({ success: false, message: 'levels array is required' });
    }

    for (const lvl of levels) {
      if (lvl.levelNumber) {
        await ProgrammingLevel.findOneAndUpdate(
          { languageId: id, levelNumber: lvl.levelNumber },
          {
            $set: {
              ...(lvl.title ? { title: lvl.title } : {}),
              ...(lvl.description !== undefined ? { description: lvl.description } : {})
            }
          }
        );
      }
    }

    await logAudit('COURSE_LEVELS_UPDATED', { languageId: id }, req);
    return res.json({ success: true, message: 'Course levels updated successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error updating level details', error: error.message });
  }
}

// QUESTION MANAGEMENT
export async function getQuestions(req: AuthRequest, res: Response) {
  try {
    const { level, targetLevel, difficulty, search, languageId } = req.query;
    const query: any = { isArchived: false };

    const selectedLevel = level || targetLevel;
    if (selectedLevel) query.targetLevel = parseInt(selectedLevel as string, 10);
    if (difficulty) query.difficulty = difficulty;
    if (languageId) query.languageId = languageId;
    if (search) query.title = { $regex: search, $options: 'i' };

    const questions = await Question.find(query)
      .populate('languageId', 'name slug executionEngineId')
      .sort({ targetLevel: 1, createdAt: -1 })
      .lean();
    const qIds = questions.map((q) => q._id);
    const testCases = await TestCase.find({ questionId: { $in: qIds } }).sort({ order: 1 }).lean();

    const tcMap = new Map<string, any[]>();
    testCases.forEach((tc) => {
      const qId = tc.questionId.toString();
      if (!tcMap.has(qId)) tcMap.set(qId, []);
      tcMap.get(qId)!.push(tc);
    });

    const enriched = questions.map((q) => ({
      ...q,
      testCases: tcMap.get(q._id.toString()) || []
    }));

    return res.json({ success: true, questions: enriched });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error retrieving questions', error: error.message });
  }
}

export async function createQuestion(req: AuthRequest, res: Response) {
  try {
    const {
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      examples,
      allowedLanguages,
      languageId,
      targetLevel,
      difficulty,
      marks,
      testCases
    } = req.body;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const question = await Question.create({
      title,
      slug,
      description,
      inputFormat,
      outputFormat,
      constraints,
      examples: examples || [],
      allowedLanguages: allowedLanguages || ['c', 'cpp', 'java', 'python'],
      languageId: languageId || undefined,
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
      await TestCase.insertMany(tcDocs);
    }

    await logAudit('QUESTION_CREATED', { questionId: question._id, title }, req);
    return res.status(201).json({ success: true, question });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Question creation failed', error: error.message });
  }
}

export async function updateQuestion(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { testCases, ...updateFields } = req.body;

    const question = await Question.findByIdAndUpdate(id, updateFields, { new: true });
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    if (Array.isArray(testCases)) {
      await TestCase.deleteMany({ questionId: question._id });
      const tcDocs = testCases.map((tc, idx) => ({
        questionId: question._id,
        input: tc.input || '',
        expectedOutput: tc.expectedOutput || '',
        isHidden: tc.isHidden || false,
        weight: tc.weight || 1,
        order: idx
      }));
      await TestCase.insertMany(tcDocs);
    }

    await logAudit('QUESTION_UPDATED', { questionId: id }, req);
    return res.json({ success: true, question });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Question update failed', error: error.message });
  }
}

export async function deleteQuestion(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    await Question.findByIdAndUpdate(id, { isArchived: true });
    await logAudit('QUESTION_ARCHIVED', { questionId: id }, req);
    return res.json({ success: true, message: 'Question archived.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Delete error', error: error.message });
  }
}

// EXAMINATION MANAGEMENT
export async function getAdminExams(_req: AuthRequest, res: Response) {
  try {
    const exams = await Examination.find().populate('languageId').sort({ createdAt: -1 });
    const examIds = exams.map((e) => e._id);
    const slots = await ExaminationSlot.find({ examinationId: { $in: examIds } }).sort({ startTime: 1, labName: 1 });
    const registrations = await ExaminationRegistration.find({ examinationId: { $in: examIds }, status: { $ne: 'cancelled' } });

    const slotMap = new Map<string, any[]>();
    slots.forEach((s) => {
      const eIds = Array.isArray(s.examinationId)
        ? s.examinationId.map((id: any) => id.toString())
        : [s.examinationId?.toString()];

      eIds.forEach((eId: string) => {
        if (eId) {
          if (!slotMap.has(eId)) slotMap.set(eId, []);
          slotMap.get(eId)!.push(s);
        }
      });
    });

    const regMap = new Map<string, number>();
    registrations.forEach((r) => {
      const eId = r.examinationId.toString();
      regMap.set(eId, (regMap.get(eId) || 0) + 1);
    });

    const enriched = exams.map((e) => ({
      ...e.toObject(),
      slots: slotMap.get(e._id.toString()) || [],
      registeredCount: regMap.get(e._id.toString()) || 0
    }));

    // Calculate actual active registrations per slot from ExaminationRegistration
    const regCountsBySlot = new Map<string, number>();
    const allActiveRegs = await ExaminationRegistration.find({
      status: { $in: ['registered', 'attended'] }
    }).select('slotId');
    allActiveRegs.forEach((r) => {
      if (r.slotId) {
        const sId = r.slotId.toString();
        regCountsBySlot.set(sId, (regCountsBySlot.get(sId) || 0) + 1);
      }
    });

    // Campus-wide distinct collegiate slots (Lab 1, Lab 2, Lab 3 across standard windows)
    const distinctCollegiateSlots = await ExaminationSlot.find({ isActive: true })
      .sort({ startTime: 1, labName: 1 });

    const syncedCollegiateSlots = distinctCollegiateSlots.map((s) => {
      const realCount = Math.max(s.registeredCount || 0, regCountsBySlot.get(s._id.toString()) || 0);
      const obj = s.toObject();
      obj.registeredCount = realCount;
      return obj;
    });

    return res.json({
      success: true,
      exams: enriched,
      collegiateSlots: syncedCollegiateSlots
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Exams fetch error', error: error.message });
  }
}

export async function createExam(req: AuthRequest, res: Response) {
  try {
    const {
      title,
      description,
      languageId,
      levelNumber,
      registrationStartDate,
      registrationEndDate,
      examDate,
      durationMinutes,
      maxStudents,
      passingPercentage,
      questions,
      allowedLanguages,
      instructions,
      isPublished,
      sebRequired,
      collegeNetworkOnly,
      slots
    } = req.body;

    const parsedExamDate = new Date(examDate);

    // Rule: Registration opens strictly on the previous day at 9:00 PM (21:00:00)
    let regStart: Date;
    if (registrationStartDate) {
      regStart = new Date(registrationStartDate);
    } else {
      regStart = new Date(parsedExamDate);
      regStart.setDate(regStart.getDate() - 1);
      regStart.setHours(21, 0, 0, 0);
    }

    const regEnd = registrationEndDate ? new Date(registrationEndDate) : new Date(parsedExamDate.getTime() + 18 * 3600000);

    const exam = await Examination.create({
      title,
      description,
      languageId,
      levelNumber: levelNumber || 1,
      registrationStartDate: regStart,
      registrationEndDate: regEnd,
      examDate: parsedExamDate,
      durationMinutes: durationMinutes || 60,
      maxStudents: maxStudents || 450, // 5 slots * 3 labs * 30 seats = 450 max
      passingPercentage: passingPercentage || 100,
      questions: questions || [],
      allowedLanguages: allowedLanguages || ['c', 'cpp', 'java', 'python'],
      instructions: instructions || 'Follow exam guidelines.',
      isPublished: isPublished !== undefined ? isPublished : false,
      sebRequired: !!sebRequired,
      collegeNetworkOnly: !!collegeNetworkOnly,
      createdBy: req.userId
    });

    // Create 15 standard collegiate slots (5 Time Windows x 3 Labs x 30 Capacity)
    if (Array.isArray(slots) && slots.length > 0) {
      const slotDocs = slots.map((s) => ({
        examinationId: exam._id,
        slotName: s.slotName || 'Main Slot',
        labName: s.labName || 'Lab 1',
        timeWindow: s.timeWindow || '09:15 to 10:15',
        startTime: new Date(s.startTime || exam.examDate),
        endTime: new Date(s.endTime || new Date(new Date(exam.examDate).getTime() + exam.durationMinutes * 60000)),
        capacity: s.capacity || 30,
        registeredCount: 0,
        isActive: true
      }));
      await ExaminationSlot.insertMany(slotDocs);
    } else {
      const startOfDay = new Date(parsedExamDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(parsedExamDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingSlots = await ExaminationSlot.find({
        startTime: { $gte: startOfDay, $lte: endOfDay }
      });

      if (existingSlots.length > 0) {
        // Link new exam to existing shared collegiate slots for this date
        await ExaminationSlot.updateMany(
          { startTime: { $gte: startOfDay, $lte: endOfDay } },
          { $addToSet: { examinationId: exam._id } }
        );
      } else {
        const standardTimeWindows = [
          { startH: 9, startM: 15, endH: 10, endM: 15, label: '09:15 to 10:15' },
          { startH: 10, startM: 25, endH: 11, endM: 25, label: '10:25 to 11:25' },
          { startH: 11, startM: 35, endH: 12, endM: 35, label: '11:35 to 12:35' },
          { startH: 13, startM: 30, endH: 14, endM: 30, label: '1:30 to 2:30 (13:30 - 14:30)' },
          { startH: 14, startM: 45, endH: 15, endM: 45, label: '2:45 to 3:45 (14:45 - 15:45)' }
        ];
        const labs = ['Lab 1', 'Lab 2', 'Lab 3'];

        const slotDocs: any[] = [];
        for (const win of standardTimeWindows) {
          for (const lab of labs) {
            const startTime = new Date(parsedExamDate);
            startTime.setHours(win.startH, win.startM, 0, 0);

            const endTime = new Date(parsedExamDate);
            endTime.setHours(win.endH, win.endM, 0, 0);

            slotDocs.push({
              examinationId: [exam._id],
              slotName: `${win.label} - ${lab}`,
              labName: lab,
              timeWindow: win.label,
              startTime,
              endTime,
              capacity: 30, // Each physical lab strictly has 30 seats
              registeredCount: 0,
              isActive: true
            });
          }
        }
        await ExaminationSlot.insertMany(slotDocs);
      }
    }

    await logAudit('EXAMINATION_CREATED', { examId: exam._id, title }, req);
    return res.status(201).json({ success: true, exam });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Exam creation error', error: error.message });
  }
}

export async function togglePublishExam(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    const exam = await Examination.findByIdAndUpdate(id, { isPublished }, { new: true });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    await logAudit('EXAMINATION_PUBLISH_TOGGLED', { examId: id, isPublished }, req);
    return res.json({ success: true, exam });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Publish toggle failed', error: error.message });
  }
}

export async function addExamSlot(req: AuthRequest, res: Response) {
  try {
    const { id: examinationId } = req.params;
    const { slotName, startTime, endTime, capacity } = req.body;

    const slot = await ExaminationSlot.create({
      examinationId,
      slotName,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      capacity: capacity || 50,
      registeredCount: 0,
      isActive: true
    });

    await logAudit('EXAM_SLOT_ADDED', { examinationId, slotId: slot._id }, req);
    return res.status(201).json({ success: true, slot });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to add slot', error: error.message });
  }
}

// RESULTS & LEADERBOARD RANKING (LEVEL POINTS SYSTEM: L1=2pts, L2=4pts, +2pts/lvl)
export async function getStudentRankingsData() {
  const [students, profiles, passedResults, progressDocs] = await Promise.all([
    User.find({ role: 'student', isActive: true })
      .select('_id firstName lastName email studentId department year section')
      .lean(),
    StudentProfile.find().lean(),
    ExaminationResult.find({ passed: true })
      .populate('examinationId', 'title levelNumber')
      .populate('languageId', 'name slug')
      .sort({ verifiedAt: 1 })
      .lean(),
    StudentProgress.find()
      .populate('languageId', 'name slug')
      .lean()
  ]);

  const profileMap = new Map<string, any>(
    profiles.map((p: any) => [p.userId.toString(), p])
  );

  // Group unique cleared levels per student: Map<studentId, Map<languageId_levelNumber, clearedLevelObj>>
  const studentLevelsMap = new Map<string, Map<string, any>>();

  // 1. Process from ExaminationResult
  for (const r of passedResults) {
    if (!r.studentId) continue;
    const sId = (r.studentId as any)._id ? (r.studentId as any)._id.toString() : r.studentId.toString();
    const langId = (r.languageId as any)?._id ? (r.languageId as any)._id.toString() : (r.languageId?.toString() || 'lang');
    const levelNumber = Number(r.levelNumber) || 1;
    const key = `${langId}_${levelNumber}`;

    if (!studentLevelsMap.has(sId)) {
      studentLevelsMap.set(sId, new Map());
    }
    const userMap = studentLevelsMap.get(sId)!;
    if (!userMap.has(key)) {
      userMap.set(key, {
        languageId: langId,
        languageName: (r.languageId as any)?.name || 'General',
        languageSlug: (r.languageId as any)?.slug || 'code',
        levelNumber,
        points: levelNumber * 2, // Level 1 = 2 pts, Level 2 = 4 pts, simultaneously increases 2 pts/level
        obtainedMarks: r.obtainedMarks || 100,
        percentage: r.percentage || 100,
        passedAt: r.verifiedAt || (r as any).createdAt
      });
    }
  }

  // 2. Process from StudentProgress.completedLevels
  for (const p of progressDocs) {
    if (!p.studentId) continue;
    const sId = p.studentId.toString();
    const langId = (p.languageId as any)?._id ? (p.languageId as any)._id.toString() : (p.languageId?.toString() || 'lang');
    const langName = (p.languageId as any)?.name || 'General';
    const langSlug = (p.languageId as any)?.slug || 'code';

    if (!studentLevelsMap.has(sId)) {
      studentLevelsMap.set(sId, new Map());
    }
    const userMap = studentLevelsMap.get(sId)!;

    for (const cl of (p.completedLevels || [])) {
      const levelNumber = Number(cl.levelNumber) || 1;
      const key = `${langId}_${levelNumber}`;
      if (!userMap.has(key)) {
        userMap.set(key, {
          languageId: langId,
          languageName: langName,
          languageSlug: langSlug,
          levelNumber,
          points: levelNumber * 2, // Level 1 = 2 pts, Level 2 = 4 pts, etc.
          obtainedMarks: cl.obtainedMarks || 100,
          percentage: cl.percentage || 100,
          passedAt: cl.passedAt || (p as any).updatedAt
        });
      }
    }
  }

  // Build ranked students - initialize with all college departments
  const departmentsSet = new Set<string>(ALL_COLLEGE_DEPARTMENTS);

  const studentRankings = students.map((s: any) => {
    const sId = s._id.toString();
    const profile = profileMap.get(sId);
    const userLevelsMap = studentLevelsMap.get(sId) || new Map();
    const clearedLevels = Array.from(userLevelsMap.values()).sort((a, b) => a.levelNumber - b.levelNumber);

    let totalPoints = 0;
    let totalScore = 0;
    let maxLevel = 0;
    let latestPassDate: Date | null = null;

    clearedLevels.forEach((lvl: any) => {
      totalPoints += lvl.points;
      totalScore += lvl.percentage;
      if (lvl.levelNumber > maxLevel) maxLevel = lvl.levelNumber;
      if (!latestPassDate || new Date(lvl.passedAt) > new Date(latestPassDate)) {
        latestPassDate = lvl.passedAt;
      }
    });

    const averageScore = clearedLevels.length > 0 ? Math.round(totalScore / clearedLevels.length) : 0;
    let department = profile?.department || s.department || 'Computer Science and Engineering';
    let year = Number(s.year || profile?.year || (profile?.semester ? Math.ceil(profile.semester / 2) : 1));

    // Institutional categorization via college email
    const emailInfo = parseCollegeEmail(s.email);
    if (emailInfo.isValid) {
      if (emailInfo.departmentName) department = emailInfo.departmentName;
      if (emailInfo.year) year = emailInfo.year;
    }

    departmentsSet.add(department);

    return {
      studentId: s._id,
      rollNumber: s.studentId || profile?.studentId || 'N/A',
      name: `${s.firstName} ${s.lastName}`.trim(),
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      department,
      year,
      section: s.section || 'A',
      totalPoints,
      levelsClearedCount: clearedLevels.length,
      highestLevel: maxLevel,
      averageScore,
      clearedLevels,
      lastPassedAt: latestPassDate
    };
  });

  // Sort by totalPoints descending, averageScore descending, levelsClearedCount descending
  studentRankings.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (b.averageScore !== a.averageScore) {
      return b.averageScore - a.averageScore;
    }
    if (b.levelsClearedCount !== a.levelsClearedCount) {
      return b.levelsClearedCount - a.levelsClearedCount;
    }
    return a.name.localeCompare(b.name);
  });

  // Assign overall rank
  const rankedWithPositions = studentRankings.map((s, idx) => {
    const rank = idx + 1;
    let badge = `#${rank}`;
    if (rank === 1 && s.totalPoints > 0) badge = '🥇 1st';
    else if (rank === 2 && s.totalPoints > 0) badge = '🥈 2nd';
    else if (rank === 3 && s.totalPoints > 0) badge = '🥉 3rd';

    return {
      ...s,
      rank,
      badge
    };
  });

  return {
    rankings: rankedWithPositions,
    departments: Array.from(departmentsSet).sort(),
    years: [1, 2, 3, 4]
  };
}

export async function getAdminResults(req: AuthRequest, res: Response) {
  try {
    const { department, year, search, sortBy, level, languageId } = req.query;

    const { rankings, departments, years } = await getStudentRankingsData();

    let filtered = [...rankings];

    // Filter by department
    if (department && department !== 'all') {
      filtered = filtered.filter((s) => s.department === department);
    }

    // Filter by year (1, 2, 3, 4)
    if (year && year !== 'all') {
      const yearNum = parseInt(year as string, 10);
      filtered = filtered.filter((s) => s.year === yearNum);
    }

    // Search query
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      );
    }

    // Sort using requested sortBy (Points, Year, Department, Name)
    if (sortBy === 'points_desc') {
      filtered.sort((a, b) => b.totalPoints - a.totalPoints || a.rank - b.rank);
    } else if (sortBy === 'points_asc') {
      filtered.sort((a, b) => a.totalPoints - b.totalPoints || a.name.localeCompare(b.name));
    } else if (sortBy === 'year_asc') {
      filtered.sort((a, b) => a.year - b.year || b.totalPoints - a.totalPoints);
    } else if (sortBy === 'year_desc') {
      filtered.sort((a, b) => b.year - a.year || b.totalPoints - a.totalPoints);
    } else if (sortBy === 'department_asc') {
      filtered.sort((a, b) => a.department.localeCompare(b.department) || b.totalPoints - a.totalPoints);
    } else if (sortBy === 'name_asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Summary calculations
    const totalPointsAwarded = rankings.reduce((acc, s) => acc + s.totalPoints, 0);
    const rankedStudentsCount = rankings.filter((s) => s.totalPoints > 0).length;
    const topStudent = rankings.find((s) => s.totalPoints > 0) || rankings[0] || null;

    // Backward-compatibility results array
    const legacyResults = await ExaminationResult.find({ passed: true })
      .populate('studentId', 'firstName lastName email studentId department')
      .populate('examinationId', 'title levelNumber passingPercentage durationMinutes')
      .populate('languageId', 'name slug executionEngineId')
      .populate('sessionId', 'status startedAt finishedAt feedback')
      .sort({ verifiedAt: -1 })
      .lean();

    return res.json({
      success: true,
      rankings: filtered,
      allRankings: rankings,
      summary: {
        totalStudents: rankings.length,
        rankedStudentsCount,
        totalPointsAwarded,
        topStudent
      },
      departments,
      years,
      results: legacyResults
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Results error', error: error.message });
  }
}

export async function exportResultsCsv(req: AuthRequest, res: Response) {
  try {
    const { department, year, sortBy, search } = req.query;
    const { rankings } = await getStudentRankingsData();

    let exportList = [...rankings];
    if (department && department !== 'all') {
      exportList = exportList.filter((s) => s.department === department);
    }
    if (year && year !== 'all') {
      const yearNum = parseInt(year as string, 10);
      exportList = exportList.filter((s) => s.year === yearNum);
    }
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      exportList = exportList.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      );
    }

    // Apply sorting
    if (sortBy === 'points_asc') {
      exportList.sort((a, b) => a.totalPoints - b.totalPoints);
    } else if (sortBy === 'year_asc') {
      exportList.sort((a, b) => a.year - b.year || b.totalPoints - a.totalPoints);
    } else if (sortBy === 'year_desc') {
      exportList.sort((a, b) => b.year - a.year || b.totalPoints - a.totalPoints);
    } else if (sortBy === 'department_asc') {
      exportList.sort((a, b) => a.department.localeCompare(b.department) || b.totalPoints - a.totalPoints);
    } else if (sortBy === 'name_asc') {
      exportList.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: points_desc
      exportList.sort((a, b) => b.totalPoints - a.totalPoints || b.averageScore - a.averageScore);
    }

    let csv = 'Rank,RollNumber,CandidateName,Email,Department,Year,TotalPoints,LevelsClearedCount,ClearedLevelsSummary,AverageScore\n';
    exportList.forEach((s, idx) => {
      const rankNum = idx + 1;
      const clearedSummary = (s.clearedLevels || [])
        .map((cl: any) => `${cl.languageName} L${cl.levelNumber} (${cl.points} pts)`)
        .join(' | ');
      csv += `"${rankNum}","${s.rollNumber}","${s.name}","${s.email}","${s.department}","Year ${s.year}","${s.totalPoints}","${s.levelsClearedCount}","${clearedSummary}","${s.averageScore}%"\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="student_academic_rankings.csv"');
    return res.status(200).send(csv);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'CSV export error', error: error.message });
  }
}

// AUDIT & SECURITY CONFIGURATION
export async function getAuditLogs(req: AuthRequest, res: Response) {
  try {
    const { action, limit = '100' } = req.query;
    const query: any = {};
    if (action) query.action = action;

    const logs = await AuditLog.find(query).sort({ timestamp: -1 }).limit(parseInt(limit as string, 10));
    return res.json({ success: true, logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Audit fetch error', error: error.message });
  }
}

export async function getPlatformConfig(_req: AuthRequest, res: Response) {
  try {
    let config = await PlatformConfiguration.findOne({ key: 'global_config' });
    if (!config) {
      config = await PlatformConfiguration.create({
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Config fetch error', error: error.message });
  }
}

export async function updatePlatformConfig(req: AuthRequest, res: Response) {
  try {
    const { collegeNetworkRanges, sebEnforced, sebConfigKey, sebQuitPassword, allowStudentSelfRegistration } = req.body;

    let config = await PlatformConfiguration.findOne({ key: 'global_config' });
    if (!config) {
      config = new PlatformConfiguration({ key: 'global_config' });
    }

    if (collegeNetworkRanges) config.collegeNetworkRanges = collegeNetworkRanges;
    if (sebEnforced !== undefined) config.sebEnforced = sebEnforced;
    if (sebConfigKey !== undefined) config.sebConfigKey = sebConfigKey;
    if (sebQuitPassword !== undefined) config.sebQuitPassword = sebQuitPassword;
    if (allowStudentSelfRegistration !== undefined) config.allowStudentSelfRegistration = allowStudentSelfRegistration;
    config.updatedBy = req.userId as any;

    await config.save();
    await logAudit('PLATFORM_CONFIG_UPDATED', req.body, req);

    return res.json({ success: true, config });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Config update failed', error: error.message });
  }
}

export async function downloadSebConfig(_req: Request, res: Response) {
  try {
    const config = await PlatformConfiguration.findOne({ key: 'global_config' });
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'SEB config generation error', error: error.message });
  }
}

/**
 * ATTENDANCE & HALL INVIGILATION
 * Retrieves all registered students for a specific exam slot, their attendance status,
 * student profile info, and slot capacity summary.
 */
export async function getSlotAttendance(req: AuthRequest, res: Response) {
  try {
    const { id: examinationId, slotId } = req.params;

    const [exam, slot] = await Promise.all([
      Examination.findById(examinationId).populate('languageId', 'name slug'),
      ExaminationSlot.findById(slotId)
    ]);

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Examination not found' });
    }
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Examination slot not found' });
    }

    const registrations = await ExaminationRegistration.find({
      examinationId,
      slotId,
      status: { $ne: 'cancelled' }
    })
      .populate('studentId', 'firstName lastName email studentId department year section')
      .populate('markedBy', 'firstName lastName email role')
      .sort({ registeredAt: 1 });

    const totalRegistered = registrations.length;
    const presentCount = registrations.filter((r) => r.attendanceStatus === 'present').length;
    const absentCount = registrations.filter((r) => r.attendanceStatus === 'absent').length;
    const pendingCount = registrations.filter((r) => !r.attendanceStatus || r.attendanceStatus === 'pending').length;

    return res.json({
      success: true,
      exam: {
        id: exam._id,
        title: exam.title,
        levelNumber: exam.levelNumber,
        language: exam.languageId
      },
      slot: {
        id: slot._id,
        slotName: slot.slotName,
        labName: slot.labName,
        timeWindow: slot.timeWindow,
        startTime: slot.startTime,
        endTime: slot.endTime,
        capacity: slot.capacity,
        registeredCount: slot.registeredCount
      },
      summary: {
        totalRegistered,
        presentCount,
        absentCount,
        pendingCount,
        capacity: slot.capacity,
        availableSeats: Math.max(0, slot.capacity - totalRegistered)
      },
      students: registrations.map((r: any) => ({
        registrationId: r._id,
        student: r.studentId,
        attendanceStatus: r.attendanceStatus || 'pending',
        markedPresentAt: r.markedPresentAt,
        markedBy: r.markedBy,
        registeredAt: r.registeredAt
      }))
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch slot attendance', error: error.message });
  }
}

/**
 * Invigilator marks an individual student as Present, Absent, or Pending.
 * Only when marked Present can the student attend/take the test.
 */
export async function markStudentAttendance(req: AuthRequest, res: Response) {
  try {
    const { id: examinationId, slotId } = req.params;
    const { studentId, status } = req.body;

    if (!['present', 'absent', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'present', 'absent', or 'pending'"
      });
    }

    const registration = await ExaminationRegistration.findOne({
      examinationId,
      slotId,
      studentId,
      status: { $ne: 'cancelled' }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No active registration found for this student in this slot.'
      });
    }

    registration.attendanceStatus = status;
    if (status === 'present') {
      registration.markedPresentAt = new Date();
    } else if (status === 'pending') {
      registration.markedPresentAt = undefined;
    }
    registration.markedBy = new mongoose.Types.ObjectId(req.userId);
    await registration.save();

    if (status === 'present') {
      await Notification.create({
        userId: studentId,
        title: 'Attendance Verified - Ready for Exam',
        message: 'Staff has verified your attendance. You can now start your examination.',
        type: 'attendance_verified'
      });
    }

    await logAudit(
      'EXAM_ATTENDANCE_MARKED',
      { examinationId, slotId, studentId, status, markedBy: req.userId },
      req
    );

    return res.json({
      success: true,
      message: `Student marked as ${status}.`,
      registration: {
        registrationId: registration._id,
        studentId: registration.studentId,
        attendanceStatus: registration.attendanceStatus,
        markedPresentAt: registration.markedPresentAt
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update attendance', error: error.message });
  }
}

/**
 * Bulk marks multiple or all students in a slot as Present or Absent.
 */
export async function markBulkAttendance(req: AuthRequest, res: Response) {
  try {
    const { id: examinationId, slotId } = req.params;
    const { studentIds, status } = req.body;

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'present' or 'absent'" });
    }

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'studentIds array is required' });
    }

    const updateFields: any = {
      attendanceStatus: status,
      markedBy: new mongoose.Types.ObjectId(req.userId)
    };
    if (status === 'present') {
      updateFields.markedPresentAt = new Date();
    }

    const result = await ExaminationRegistration.updateMany(
      {
        examinationId,
        slotId,
        studentId: { $in: studentIds },
        status: { $ne: 'cancelled' }
      },
      { $set: updateFields }
    );

    if (status === 'present') {
      const notifications = studentIds.map((sId: string) => ({
        userId: sId,
        title: 'Attendance Verified - Ready for Exam',
        message: 'Staff has verified your attendance. You can now start your examination.',
        type: 'attendance_verified'
      }));
      await Notification.insertMany(notifications).catch(() => {});
    }

    await logAudit(
      'EXAM_ATTENDANCE_BULK_MARKED',
      { examinationId, slotId, studentCount: studentIds.length, status, markedBy: req.userId },
      req
    );

    return res.json({
      success: true,
      message: `Successfully marked ${result.modifiedCount} students as ${status}.`,
      modifiedCount: result.modifiedCount
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to bulk update attendance', error: error.message });
  }
}

/**
 * TIMING-CENTRIC LAB ATTENDANCE ROSTER
 * Retrieves all registered students across ALL courses for a given slot timing and/or lab room.
 * Staff sitting in a lab at a given timing sees all students regardless of course!
 */
export async function getAttendanceByTiming(req: AuthRequest, res: Response) {
  try {
    const { timeWindow, labName, search, status, languageId } = req.query;

    // 1. Build slot match query
    const slotQuery: any = { isActive: true };
    if (timeWindow && timeWindow !== 'all') {
      // Support matching partial or full timeWindow string (e.g. "09:15 to 10:15")
      slotQuery.timeWindow = { $regex: new RegExp(escapeRegex(timeWindow as string), 'i') };
    }
    if (labName && labName !== 'all') {
      slotQuery.labName = labName;
    }

    // Find matching slots
    const matchingSlots = await ExaminationSlot.find(slotQuery).select('_id examinationId labName timeWindow startTime endTime capacity');
    const slotIds = matchingSlots.map((s) => s._id);

    // 2. Build registration query
    const regQuery: any = {
      slotId: { $in: slotIds },
      status: { $ne: 'cancelled' }
    };

    if (status && status !== 'all') {
      if (status === 'pending') {
        regQuery.$or = [{ attendanceStatus: 'pending' }, { attendanceStatus: { $exists: false } }, { attendanceStatus: null }];
      } else {
        regQuery.attendanceStatus = status;
      }
    }

    const registrations = await ExaminationRegistration.find(regQuery)
      .populate('studentId', 'firstName lastName email studentId department year section')
      .populate({
        path: 'examinationId',
        select: 'title levelNumber languageId passingPercentage durationMinutes',
        populate: { path: 'languageId', select: 'name slug' }
      })
      .populate('slotId', 'slotName labName timeWindow startTime endTime capacity')
      .populate('markedBy', 'firstName lastName email role')
      .sort({ registeredAt: 1 });

    // Filter by language / course if requested
    let filtered = registrations;
    if (languageId && languageId !== 'all') {
      filtered = filtered.filter((r: any) => {
        const lang = r.examinationId?.languageId;
        return lang && (lang._id?.toString() === languageId || lang.slug === languageId);
      });
    }

    // Filter by search query if requested
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter((r: any) => {
        const student = r.studentId;
        const exam = r.examinationId;
        const name = `${student?.firstName || ''} ${student?.lastName || ''}`.toLowerCase();
        const sId = (student?.studentId || '').toLowerCase();
        const email = (student?.email || '').toLowerCase();
        const courseTitle = (exam?.title || '').toLowerCase();
        const langName = (exam?.languageId?.name || '').toLowerCase();
        return name.includes(q) || sId.includes(q) || email.includes(q) || courseTitle.includes(q) || langName.includes(q);
      });
    }

    // Summary counts
    const totalRegistered = filtered.length;
    const presentCount = filtered.filter((r) => r.attendanceStatus === 'present').length;
    const absentCount = filtered.filter((r) => r.attendanceStatus === 'absent').length;
    const pendingCount = filtered.filter((r) => !r.attendanceStatus || r.attendanceStatus === 'pending').length;

    // Distinct time windows from active slots
    const allSlots = await ExaminationSlot.find({ isActive: true }).select('timeWindow labName registeredCount startTime endTime');
    const timeWindowSet = new Set<string>();
    const timeWindowDateMap: Record<string, string> = {};
    const labSet = new Set<string>();
    allSlots.forEach((s) => {
      if (s.timeWindow) {
        timeWindowSet.add(s.timeWindow);
        if (s.startTime && !timeWindowDateMap[s.timeWindow]) {
          timeWindowDateMap[s.timeWindow] = s.startTime.toISOString();
        }
      }
      if (s.labName) labSet.add(s.labName);
    });

    const standardTimeWindows = [
      '09:15 to 10:15',
      '10:25 to 11:25',
      '11:35 to 12:35',
      '1:30 to 2:30 (13:30 - 14:30)',
      '2:45 to 3:45 (14:45 - 15:45)'
    ];

    // If slots have other windows, append them
    timeWindowSet.forEach((tw) => {
      if (!standardTimeWindows.some((sw) => sw.includes(tw) || tw.includes(sw))) {
        standardTimeWindows.push(tw);
      }
    });

    const students = filtered.map((r: any) => ({
      registrationId: r._id,
      student: r.studentId,
      course: {
        id: r.examinationId?._id,
        title: r.examinationId?.title,
        levelNumber: r.examinationId?.levelNumber,
        languageName: r.examinationId?.languageId?.name || 'General',
        languageSlug: r.examinationId?.languageId?.slug || 'c'
      },
      slot: {
        id: r.slotId?._id,
        slotName: r.slotId?.slotName,
        labName: r.slotId?.labName,
        timeWindow: r.slotId?.timeWindow,
        startTime: r.slotId?.startTime,
        endTime: r.slotId?.endTime,
        capacity: r.slotId?.capacity
      },
      attendanceStatus: r.attendanceStatus || 'pending',
      markedPresentAt: r.markedPresentAt,
      markedBy: r.markedBy,
      registeredAt: r.registeredAt
    }));

    return res.json({
      success: true,
      timeWindows: standardTimeWindows,
      timeWindowDates: timeWindowDateMap,
      labs: ['Lab 1', 'Lab 2', 'Lab 3'],
      summary: {
        totalRegistered,
        presentCount,
        absentCount,
        pendingCount
      },
      students
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch attendance by timing', error: error.message });
  }
}

/**
 * Directly mark attendance for a registration record by its registrationId
 */
export async function markAttendanceDirect(req: AuthRequest, res: Response) {
  try {
    const { registrationId, status } = req.body;

    if (!['present', 'absent', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'present', 'absent', or 'pending'" });
    }

    const registration = await ExaminationRegistration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    registration.attendanceStatus = status;
    if (status === 'present') {
      registration.markedPresentAt = new Date();
    } else if (status === 'pending') {
      registration.markedPresentAt = undefined;
    }
    registration.markedBy = new mongoose.Types.ObjectId(req.userId);
    await registration.save();

    if (status === 'present') {
      await Notification.create({
        userId: registration.studentId,
        title: 'Attendance Verified - Ready for Exam',
        message: 'Staff has verified your attendance. You can now start your examination.',
        type: 'attendance_verified'
      });
    }

    await logAudit(
      'EXAM_ATTENDANCE_MARKED',
      { registrationId, studentId: registration.studentId, status, markedBy: req.userId },
      req
    );

    return res.json({
      success: true,
      message: `Student marked as ${status}.`,
      registration: {
        registrationId: registration._id,
        attendanceStatus: registration.attendanceStatus,
        markedPresentAt: registration.markedPresentAt
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update attendance', error: error.message });
  }
}

/**
 * Bulk mark multiple registrations as present or absent by registration IDs
 */
export async function markBulkAttendanceDirect(req: AuthRequest, res: Response) {
  try {
    const { registrationIds, status } = req.body;

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'present' or 'absent'" });
    }

    if (!Array.isArray(registrationIds) || registrationIds.length === 0) {
      return res.status(400).json({ success: false, message: 'registrationIds array is required' });
    }

    const updateFields: any = {
      attendanceStatus: status,
      markedBy: new mongoose.Types.ObjectId(req.userId)
    };
    if (status === 'present') {
      updateFields.markedPresentAt = new Date();
    }

    const registrations = await ExaminationRegistration.find({ _id: { $in: registrationIds } });

    await ExaminationRegistration.updateMany(
      { _id: { $in: registrationIds } },
      { $set: updateFields }
    );

    if (status === 'present') {
      const notifications = registrations.map((r) => ({
        userId: r.studentId,
        title: 'Attendance Verified - Ready for Exam',
        message: 'Staff has verified your attendance. You can now start your examination.',
        type: 'attendance_verified'
      }));
      await Notification.insertMany(notifications).catch(() => {});
    }

    await logAudit(
      'EXAM_ATTENDANCE_BULK_MARKED',
      { count: registrationIds.length, status, markedBy: req.userId },
      req
    );

    return res.json({
      success: true,
      message: `Successfully marked ${registrationIds.length} students as ${status}.`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to bulk update attendance', error: error.message });
  }
}

/**
 * Admin action: Remove an absent course from a student's "My Courses".
 * Rule: If a student is absent in the exam, ONLY admin can remove that course in My Courses.
 * After that, the student can register for the exam again in Total Courses.
 */
export async function removeAbsentCourseFromStudent(req: AuthRequest, res: Response) {
  try {
    const { registrationId } = req.body;

    if (!registrationId) {
      return res.status(400).json({ success: false, message: 'registrationId is required' });
    }

    const registration = await ExaminationRegistration.findById(registrationId).populate('examinationId');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    if (registration.attendanceStatus !== 'absent') {
      return res.status(400).json({
        success: false,
        message: 'Only registrations marked as absent can be removed from student My Courses by admin.'
      });
    }

    const exam = registration.examinationId as any;
    const studentId = registration.studentId;

    // 1. Decrement slot count if slot exists
    if (registration.slotId) {
      await ExaminationSlot.findByIdAndUpdate(registration.slotId, {
        $inc: { registeredCount: -1 }
      });
    }

    // 2. Remove levelNumber from student's enrolledLevels in StudentProgress
    if (exam && exam.languageId && exam.levelNumber) {
      const progress = await StudentProgress.findOne({
        studentId,
        languageId: exam.languageId
      });
      if (progress && progress.enrolledLevels) {
        progress.enrolledLevels = progress.enrolledLevels.filter((l) => l !== exam.levelNumber);
        if (progress.enrolledLevels.length === 0) {
          progress.isEnrolled = false;
        }
        await progress.save();
      }
    }

    // 3. Delete the absent registration so the student is freed to re-register
    await ExaminationRegistration.findByIdAndDelete(registrationId);

    // 4. Notify student
    await Notification.create({
      userId: studentId,
      title: `Absent Course Cleared: ${exam?.title || 'Examination'}`,
      message: `The administrator has removed your absent exam record for ${exam?.title || 'Level ' + (exam?.levelNumber || '')}. You can now register for the course level again in Total Courses.`,
      type: 'registration_cleared'
    }).catch(() => {});

    // 5. Audit log
    await logAudit(
      'ADMIN_REMOVED_ABSENT_COURSE',
      {
        registrationId,
        studentId,
        examId: exam?._id,
        levelNumber: exam?.levelNumber,
        clearedBy: req.userId
      },
      req
    );

    return res.json({
      success: true,
      message: `Successfully removed absent course from student's My Courses. The student may now register again in Total Courses.`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to remove absent course', error: error.message });
  }
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Quick search / lookup for students by studentId, name, or email for faculty test assignment
 */
export async function searchStudentsForAssignment(req: AuthRequest, res: Response) {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      const students = await User.find({ role: 'student', isActive: true })
        .select('_id studentId firstName lastName email department year section')
        .limit(10);
      return res.json({ success: true, students });
    }

    const q = escapeRegex(query.trim());
    const students = await User.find({
      role: 'student',
      isActive: true,
      $or: [
        { studentId: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    })
      .select('_id studentId firstName lastName email department year section')
      .limit(15);

    return res.json({ success: true, students });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Student search error', error: error.message });
  }
}

/**
 * Faculty Fast-Track Assignment:
 * When a student clears questions early in their slot (e.g. within 20 mins),
 * faculty can assign another course/level test using the student's ID.
 * This directly enrolls the student, secures an open lab slot, and marks attendance as 'present'
 * so the student can immediately launch and take the new test.
 */
export async function assignStudentToCourseExam(req: AuthRequest, res: Response) {
  try {
    const { studentIdentifier, examinationId, labName, timeWindow } = req.body;

    if (!studentIdentifier) {
      return res.status(400).json({ success: false, message: 'Student ID or register number is required.' });
    }
    if (!examinationId) {
      return res.status(400).json({ success: false, message: 'Examination ID is required.' });
    }

    // 1. Locate student
    const trimmedId = studentIdentifier.trim();
    const student = await User.findOne({
      $or: [
        { studentId: trimmedId },
        { studentId: { $regex: new RegExp(`^${escapeRegex(trimmedId)}$`, 'i') } },
        { email: trimmedId.toLowerCase() },
        ...(mongoose.isValidObjectId(trimmedId) ? [{ _id: trimmedId }] : [])
      ],
      role: 'student'
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with identifier '${trimmedId}' was not found. Please verify the Student ID or Register Number.`
      });
    }

    // 2. Locate examination
    const exam = await Examination.findById(examinationId).populate('languageId');
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Examination not found.' });
    }

    const language: any = exam.languageId;
    const languageId = language._id || language;

    // 3. Ensure student course enrollment and level unlock in StudentProgress
    let progress = await StudentProgress.findOne({
      studentId: student._id,
      languageId
    });

    if (!progress) {
      progress = await StudentProgress.create({
        studentId: student._id,
        languageId,
        highestUnlockedLevel: Math.max(1, exam.levelNumber),
        completedLevels: [],
        isEnrolled: true,
        enrolledLevels: [exam.levelNumber],
        enrolledAt: new Date()
      });
    } else {
      progress.isEnrolled = true;
      if (!progress.enrolledLevels) {
        progress.enrolledLevels = [];
      }
      if (!progress.enrolledLevels.includes(exam.levelNumber)) {
        progress.enrolledLevels.push(exam.levelNumber);
      }
      if (progress.highestUnlockedLevel < exam.levelNumber) {
        progress.highestUnlockedLevel = exam.levelNumber;
      }
      await progress.save();
    }

    // 4. Find or create an active lab slot for this examination
    const now = new Date();
    const targetLab = labName || 'Lab 1';
    const targetWindow = timeWindow || '09:15 to 10:15';

    let slot = await ExaminationSlot.findOne({
      examinationId: exam._id,
      labName: targetLab,
      timeWindow: targetWindow
    });

    if (!slot) {
      slot = await ExaminationSlot.findOne({ examinationId: exam._id });
    }

    if (!slot) {
      slot = await ExaminationSlot.create({
        examinationId: exam._id,
        slotNumber: 1,
        slotName: `Fast-Track Lab Session (${targetLab})`,
        labName: targetLab,
        timeWindow: targetWindow,
        startTime: new Date(now.getTime() - 15 * 60 * 1000), // 15 mins prior so slot is immediately open
        endTime: new Date(now.getTime() + 2 * 3600 * 1000),  // 2 hours window
        capacity: 50,
        registeredCount: 0
      });
    } else {
      // Ensure the slot time window is currently open for immediate testing
      const slotEnd = new Date(slot.endTime).getTime();
      if (slotEnd < now.getTime()) {
        slot.startTime = new Date(now.getTime() - 15 * 60 * 1000);
        slot.endTime = new Date(now.getTime() + 2 * 3600 * 1000);
        await slot.save();
      }
    }

    // Increment slot registered count
    await ExaminationSlot.findByIdAndUpdate(slot._id, {
      $inc: { registeredCount: 1 }
    });

    // 5. Clean up previous registration for this exact exam if attended or cancelled
    await ExaminationRegistration.deleteMany({
      examinationId: exam._id,
      studentId: student._id
    });

    // 6. Create active registration with attendance directly marked as 'present'
    const registration = await ExaminationRegistration.create({
      examinationId: exam._id,
      slotId: slot._id,
      studentId: student._id,
      status: 'registered',
      attendanceStatus: 'present', // Staff verified present!
      markedPresentAt: now,
      markedBy: req.userId,
      registeredAt: now
    });

    // 7. Notification for the student
    await Notification.create({
      userId: student._id,
      title: `Fast-Track Test Assigned: ${exam.title}`,
      message: `Faculty has assigned you to take the ${exam.title} assessment in ${slot.labName} (${slot.timeWindow}). Your attendance is verified Present; you can take the test immediately!`,
      type: 'registration',
      read: false
    }).catch(() => {});

    await logAudit(
      'FACULTY_ASSIGNED_FAST_TRACK_EXAM',
      {
        facultyId: req.userId,
        studentId: student._id,
        studentIdentifier: student.studentId,
        examinationId: exam._id,
        slotId: slot._id,
        labName: slot.labName
      },
      req
    );

    return res.json({
      success: true,
      message: `Assigned ${student.firstName} ${student.lastName} (${student.studentId || student.email}) to ${exam.title}. Attendance is marked Present and the student can take the test immediately!`,
      assignment: {
        registrationId: registration._id,
        studentName: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId || student.email,
        examId: exam._id,
        examTitle: exam.title,
        levelNumber: exam.levelNumber,
        languageName: language.name || 'Course',
        labName: slot.labName,
        timeWindow: slot.timeWindow
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to assign course exam', error: error.message });
  }
}

/**
 * Generates a 6-digit Submission OTP.
 * STRICT TIME LIMIT: Exactly 20 seconds validity.
 * Can be used by all students without asking for student ID.
 */
export async function generateSubmissionOtp(req: AuthRequest, res: Response) {
  try {
    const { studentId, sessionId, examinationId } = req.body || {};
    const facultyId = req.userId!;

    // Optional student lookup if studentId is provided
    let student = null;
    if (studentId) {
      student = await User.findById(studentId);
      if (!student && typeof studentId === 'string') {
        student = await User.findOne({
          $or: [
            { studentId: studentId.trim() },
            { email: studentId.trim().toLowerCase() }
          ]
        });
      }
    }

    // Generate random 6-digit OTP (100000 - 999999)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    // Valid strictly for 20 SECONDS
    const expiresAt = new Date(now.getTime() + 20 * 1000);

    // Invalidate previous expired OTPs
    await SubmissionOtp.updateMany(
      { expiresAt: { $lt: now } },
      { $set: { isUsed: true, usedAt: now } }
    );

    const otpDoc = await SubmissionOtp.create({
      studentId: student?._id,
      sessionId: sessionId || undefined,
      examinationId: examinationId || undefined,
      otp,
      generatedAt: now,
      expiresAt,
      generatedBy: facultyId,
      isUsed: false,
      usedBySessions: []
    });

    await logAudit(
      'SUBMISSION_OTP_GENERATED',
      {
        otp: otpDoc.otp,
        facultyId,
        studentId: student?._id,
        validitySeconds: 20
      },
      req
    );

    return res.json({
      success: true,
      message: 'Submission OTP generated. Strictly valid for 20 seconds for all students.',
      otp: otpDoc.otp,
      generatedAt: otpDoc.generatedAt,
      expiresAt: otpDoc.expiresAt,
      validitySeconds: 20,
      student: student
        ? {
            id: student._id,
            name: `${student.firstName} ${student.lastName}`,
            studentId: student.studentId || student.email
          }
        : undefined
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to generate submission OTP', error: error.message });
  }
}


