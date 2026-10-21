import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { Examination } from '../models/Examination';
import { ExaminationSlot } from '../models/ExaminationSlot';
import { ExaminationRegistration } from '../models/ExaminationRegistration';
import { ExaminationSession } from '../models/ExaminationSession';
import { Question } from '../models/Question';
import { TestCase } from '../models/TestCase';
import { Submission } from '../models/Submission';
import { ExaminationResult } from '../models/ExaminationResult';
import { SubmissionOtp } from '../models/SubmissionOtp';
import { Notification } from '../models/Notification';
import { ProgressionService } from '../services/ProgressionService';
import { executeCodeInWorker, WorkerTestCaseInput } from '../services/ExecutionClient';
import { logAudit } from '../services/AuditService';
import { getClientIp } from '../middleware/ipCheck';
import { isSlotStartedOrPassed } from '../services/SlotTimingService';

export async function getAvailableExams(req: AuthRequest, res: Response) {
  try {
    const studentId = req.userId!;
    const exams = await Examination.find({ isPublished: true })
      .populate('languageId')
      .sort({ examDate: 1 });

    const studentProg = await ProgressionService.getStudentLanguagesProgress(studentId);

    // Annotate exams with student eligibility and status
    const annotatedExams = await Promise.all(
      exams.map(async (exam: any) => {
        const langProg = studentProg.find((p) => p.languageId === exam.languageId?._id?.toString());
        const highestUnlocked = langProg?.highestUnlockedLevel || 1;
        const isEligible = exam.levelNumber <= highestUnlocked;

        // Check if student is already registered
        const registration = await ExaminationRegistration.findOne({
          examinationId: exam._id,
          studentId,
          status: 'registered'
        }).populate('slotId');

        // Check if already passed or attempted
        const pastResult = await ExaminationResult.findOne({
          examinationId: exam._id,
          studentId
        });

        // Check registration window (Previous day 9:00 PM)
        const now = new Date();
        const regStart = new Date(exam.registrationStartDate);
        const regEnd = new Date(exam.registrationEndDate);
        const isRegistrationOpen = now >= regStart && now <= regEnd;

        // Fetch slots in real-time
        // RULE: Slots only show starting from previous day 9:00 PM
        // RULE: If slots are filled (registeredCount >= capacity), do NOT show the slot
        // RULE: If slot start time has arrived/passed (e.g. 09:15), do NOT show the slot
        let availableSlots: any[] = [];
        if (isRegistrationOpen || req.user?.role === 'admin' || req.user?.role === 'faculty') {
          const candidateSlots = await ExaminationSlot.find({
            examinationId: exam._id,
            isActive: true
          }).sort({ startTime: 1, labName: 1 });

          const slotIds = candidateSlots.map((s) => s._id);
          const activeRegs = await ExaminationRegistration.find({
            slotId: { $in: slotIds },
            status: { $in: ['registered', 'attended'] }
          }).select('slotId');

          const countsMap = new Map<string, number>();
          activeRegs.forEach((r) => {
            if (r.slotId) {
              const sid = r.slotId.toString();
              countsMap.set(sid, (countsMap.get(sid) || 0) + 1);
            }
          });

          const syncedSlots = candidateSlots.map((s) => {
            const realCount = countsMap.get(s._id.toString()) || 0;
            s.registeredCount = Math.max(s.registeredCount || 0, realCount);
            return s;
          });

          if (req.user?.role === 'student') {
            availableSlots = syncedSlots.filter((s) => s.registeredCount < s.capacity && !isSlotStartedOrPassed(s, now));
          } else {
            availableSlots = syncedSlots;
          }
        }

        return {
          id: exam._id,
          title: exam.title,
          description: exam.description,
          language: exam.languageId?.name,
          languageSlug: exam.languageId?.slug,
          levelNumber: exam.levelNumber,
          durationMinutes: exam.durationMinutes,
          passingPercentage: exam.passingPercentage,
          registrationStartDate: exam.registrationStartDate,
          registrationEndDate: exam.registrationEndDate,
          isRegistrationOpen,
          registrationMessage: isRegistrationOpen
            ? 'Registration is OPEN. Choose your lab and time slot below.'
            : `Registration opens on previous day at 9:00 PM (${regStart.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })})`,
          examDate: exam.examDate,
          instructions: exam.instructions,
          isEligible,
          lockReason: isEligible
            ? undefined
            : `Level ${exam.levelNumber} is locked. You must complete Level ${exam.levelNumber - 1} first.`,
          registration,
          pastResult,
          slots: availableSlots
        };
      })
    );

    return res.json({ success: true, exams: annotatedExams });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch examinations', error: error.message });
  }
}

export async function getExamById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const exam = await Examination.findById(id).populate('languageId');
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Examination not found' });
    }

    const now = new Date();
    const isRegistrationOpen = now >= new Date(exam.registrationStartDate) && now <= new Date(exam.registrationEndDate);

    // Filter filled slots and started/passed slots in real time for students
    let slots: any[] = [];
    if (isRegistrationOpen || req.user?.role !== 'student') {
      const candidateSlots = await ExaminationSlot.find({
        examinationId: exam._id,
        isActive: true
      }).sort({ startTime: 1, labName: 1 });

      const slotIds = candidateSlots.map((s) => s._id);
      const activeRegs = await ExaminationRegistration.find({
        slotId: { $in: slotIds },
        status: { $in: ['registered', 'attended'] }
      }).select('slotId');

      const countsMap = new Map<string, number>();
      activeRegs.forEach((r) => {
        if (r.slotId) {
          const sid = r.slotId.toString();
          countsMap.set(sid, (countsMap.get(sid) || 0) + 1);
        }
      });

      const syncedSlots = candidateSlots.map((s) => {
        const realCount = countsMap.get(s._id.toString()) || 0;
        s.registeredCount = Math.max(s.registeredCount || 0, realCount);
        return s;
      });

      if (req.user?.role === 'student') {
        slots = syncedSlots.filter((s) => s.registeredCount < s.capacity && !isSlotStartedOrPassed(s, now));
      } else {
        slots = syncedSlots;
      }
    }

    let registration = null;
    let eligibility = { isEligible: true };

    if (req.user?.role === 'student') {
      registration = await ExaminationRegistration.findOne({
        examinationId: exam._id,
        studentId: req.userId,
        status: 'registered'
      }).populate('slotId');

      eligibility = await ProgressionService.verifyEligibility(
        req.userId!,
        exam.languageId._id.toString(),
        exam.levelNumber
      );
    }

    return res.json({
      success: true,
      exam,
      isRegistrationOpen,
      registrationMessage: isRegistrationOpen
        ? 'Registration is currently open.'
        : `Registration opens on previous day at 9:00 PM (${new Date(exam.registrationStartDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })})`,
      slots,
      registration,
      eligibility
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error fetching exam', error: error.message });
  }
}

export async function registerForExamSlot(req: AuthRequest, res: Response) {
  try {
    const { id: examinationId } = req.params;
    const { slotId } = req.body;
    const studentId = req.userId!;

    if (!slotId) {
      return res.status(400).json({ success: false, message: 'Slot ID is required.' });
    }

    const exam = await Examination.findById(examinationId);
    if (!exam || !exam.isPublished) {
      return res.status(404).json({ success: false, message: 'Examination not available for registration.' });
    }

    // Verify student eligibility first
    const eligibility = await ProgressionService.verifyEligibility(
      studentId,
      exam.languageId.toString(),
      exam.levelNumber
    );

    if (!eligibility.isEligible) {
      return res.status(403).json({ success: false, message: eligibility.reason });
    }

    // Verify registration window (Previous day 9:00 PM rule)
    const now = new Date();
    if (now < exam.registrationStartDate) {
      return res.status(400).json({
        success: false,
        message: `Registration has not opened yet. Registration opens strictly on the previous day at 9:00 PM (${new Date(exam.registrationStartDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}).`
      });
    }
    if (now > exam.registrationEndDate) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed.' });
    }

    // Check existing registration
    const existingReg = await ExaminationRegistration.findOne({
      examinationId: exam._id,
      studentId
    });

    if (existingReg) {
      if (existingReg.attendanceStatus === 'absent') {
        return res.status(400).json({
          success: false,
          message: 'You were marked absent for this examination. Only an administrator or staff can remove this course from your My Courses before you can register again.'
        });
      }
      if (existingReg.status === 'registered') {
        return res.status(400).json({ success: false, message: 'You are already registered for this examination.' });
      }
      // Clean up past attended or cancelled record to avoid compound unique index collision
      if (existingReg.status === 'attended' || existingReg.status === 'cancelled') {
        await ExaminationRegistration.findByIdAndDelete(existingReg._id);
      }
    }

    // Atomic slot capacity check across all courses
    const slot = await ExaminationSlot.findById(slotId);
    if (!slot || !slot.isActive) {
      return res.status(404).json({ success: false, message: 'Selected examination slot was not found or is inactive.' });
    }

    // Verify slot has not already started or passed
    if (isSlotStartedOrPassed(slot, now)) {
      return res.status(400).json({
        success: false,
        message: 'This examination slot has already started or concluded. You cannot register for a slot that has already commenced.'
      });
    }

    // Strict atomic capacity enforcement across all courses (handles 40+ simultaneous applicants without crashing or overbooking)
    const maxCapacity = slot.capacity || 30;

    // Fast atomic conditional increment: only succeeds if registeredCount is strictly below maxCapacity (30)
    const updatedSlot = await ExaminationSlot.findOneAndUpdate(
      {
        _id: slot._id,
        isActive: true,
        registeredCount: { $lt: maxCapacity }
      },
      {
        $inc: { registeredCount: 1 },
        $addToSet: { examinationId: exam._id }
      },
      {
        new: true
      }
    );

    if (!updatedSlot) {
      return res.status(400).json({
        success: false,
        message: `Selected lab slot (${slot.labName} - ${slot.timeWindow}) is completely filled (${maxCapacity}/${maxCapacity} seats filled). In real time, full slots cannot accept new registrations. Please choose another lab room or slot.`
      });
    }

    try {
      const registration = await ExaminationRegistration.create({
        examinationId: exam._id,
        slotId: updatedSlot._id,
        studentId,
        status: 'registered',
        registeredAt: now
      });

      // Non-blocking async notification and audit logging for peak throughput
      Notification.create({
        userId: studentId,
        title: `Registered for ${exam.title}`,
        message: `Your slot (${updatedSlot.slotName || updatedSlot.timeWindow}) in ${updatedSlot.labName} has been confirmed. Exam date: ${exam.examDate.toLocaleDateString()}.`,
        type: 'registration',
        metadata: { examinationId: exam._id, slotId: updatedSlot._id }
      }).catch(() => {});

      logAudit(
        'EXAM_SLOT_REGISTERED',
        { examinationId: exam._id, slotId: updatedSlot._id, studentId },
        req
      ).catch(() => {});

      return res.status(201).json({
        success: true,
        message: 'Examination slot successfully confirmed.',
        registration
      });
    } catch (createErr: any) {
      // Revert atomic counter if creation failed
      await ExaminationSlot.findByIdAndUpdate(updatedSlot._id, {
        $inc: { registeredCount: -1 }
      });
      if (createErr.code === 11000) {
        return res.status(400).json({ success: false, message: 'You are already registered for this examination.' });
      }
      return res.status(500).json({ success: false, message: 'Registration failed', error: createErr.message });
    }
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You are already registered for this examination.' });
    }
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
}

export async function cancelRegistration(req: AuthRequest, res: Response) {
  try {
    const { id: examinationId } = req.params;
    const studentId = req.userId!;

    const registration = await ExaminationRegistration.findOne({
      examinationId,
      studentId,
      status: 'registered'
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Active registration not found.' });
    }

    registration.status = 'cancelled';
    registration.cancelledAt = new Date();
    await registration.save();

    // Decrement slot registered count
    await ExaminationSlot.findByIdAndUpdate(registration.slotId, {
      $inc: { registeredCount: -1 }
    });

    await Notification.create({
      userId: studentId,
      title: 'Examination Registration Cancelled',
      message: 'Your registration has been cancelled successfully.',
      type: 'cancellation'
    });

    await logAudit('EXAM_REGISTRATION_CANCELLED', { examinationId, studentId }, req);

    return res.json({ success: true, message: 'Registration cancelled successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Cancellation error', error: error.message });
  }
}

export async function startExaminationSession(req: AuthRequest, res: Response) {
  try {
    const { id: examinationId } = req.params;
    const studentId = req.userId!;
    const now = new Date();

    const exam = await Examination.findById(examinationId).populate('languageId');
    if (!exam || !exam.isPublished) {
      return res.status(404).json({ success: false, message: 'Examination not found or not published.' });
    }

    // Verify registration
    const registration = await ExaminationRegistration.findOne({
      examinationId: exam._id,
      studentId,
      status: 'registered'
    }).populate('slotId');

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'You do not have an active slot registration for this examination.'
      });
    }

    const slot: any = registration.slotId;
    if (!slot) {
      return res.status(400).json({ success: false, message: 'Slot configuration error.' });
    }

    // Require staff-verified attendance in the lab
    if (registration.attendanceStatus !== 'present') {
      const labName = slot?.labName || 'your assigned lab';
      return res.status(403).json({
        success: false,
        attendancePending: true,
        attendanceStatus: registration.attendanceStatus,
        message:
          registration.attendanceStatus === 'absent'
            ? 'You have been marked absent by staff for this slot.'
            : `Attendance verification required. Please report to staff in ${labName} to be marked Present before starting the test.`
      });
    }

    // Verify time window
    const slotStartTime = new Date(slot.startTime).getTime();
    const slotEndTime = new Date(slot.endTime).getTime();
    const currentTime = now.getTime();

    // Allow 15 min early entrance or during slot (bypass strict past time in test mode)
    const earlyBuffer = 15 * 60 * 1000;
    if (process.env.NODE_ENV !== 'test') {
      if (currentTime < slotStartTime - earlyBuffer) {
        return res.status(400).json({
          success: false,
          message: `This examination slot has not started yet. Slot opens at ${new Date(slot.startTime).toLocaleString()}.`
        });
      }
      if (currentTime > slotEndTime + 30 * 60 * 1000) {
        return res.status(400).json({
          success: false,
          message: 'This examination slot has already concluded.'
        });
      }
    }

    // Check for an existing active session (Refresh Recovery!)
    let session = await ExaminationSession.findOne({
      examinationId: exam._id,
      studentId,
      status: 'active'
    });

    if (session) {
      // Check if session has expired based on server deadline
      if (currentTime > session.deadline.getTime()) {
        session.status = 'expired';
        session.finishedAt = new Date();
        await session.save();
        await ProgressionService.finalizeExamSession(session._id.toString(), req);

        return res.status(400).json({
          success: false,
          message: 'Your examination session deadline has expired.'
        });
      }

      await logAudit('EXAM_SESSION_RESUMED', { sessionId: session._id, studentId }, req);

      return res.json({
        success: true,
        sessionId: session._id,
        resumed: true,
        message: 'Session resumed successfully.'
      });
    }

    // Verify eligibility
    const eligibility = await ProgressionService.verifyEligibility(
      studentId,
      exam.languageId._id.toString(),
      exam.levelNumber
    );

    if (!eligibility.isEligible) {
      return res.status(403).json({ success: false, message: eligibility.reason });
    }

    // Authoritative Server-side Deadline calculation
    const durationMs = exam.durationMinutes * 60 * 1000;
    const maxCalculatedDeadline = currentTime + durationMs;
    // Deadline cannot exceed slot end time + 5m grace
    const finalDeadlineTime = Math.min(maxCalculatedDeadline, slotEndTime + 5 * 60 * 1000);
    const deadline = new Date(finalDeadlineTime);

    // Multi-Question Pool & Per-Student Shuffling:
    // Pull questions matching this exam, course/language, and target level.
    // Shuffle the candidate pool so each student receives an independently randomized set of 2 questions.
    const langId = exam.languageId?._id || exam.languageId;
    const engineSlug = (exam.languageId as any)?.slug || (exam.languageId as any)?.executionEngineId;

    const candidateQuestions = await Question.find({
      $or: [
        { _id: { $in: exam.questions || [] } },
        { languageId: langId, targetLevel: exam.levelNumber, isArchived: false, isDraft: false },
        ...(engineSlug
          ? [{ allowedLanguages: engineSlug, targetLevel: exam.levelNumber, isArchived: false, isDraft: false }]
          : [])
      ],
      isArchived: false,
      isDraft: false
    }).select('_id').lean();

    const uniqueQuestionIds = Array.from(new Set(candidateQuestions.map((q: any) => q._id.toString())));

    // Fisher-Yates Shuffle
    for (let i = uniqueQuestionIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueQuestionIds[i], uniqueQuestionIds[j]] = [uniqueQuestionIds[j], uniqueQuestionIds[i]];
    }

    const assignedQuestionIds = (
      uniqueQuestionIds.length > 0
        ? uniqueQuestionIds.slice(0, 2)
        : (exam.questions || []).slice(0, 2)
    ).map((id: string | any) => new mongoose.Types.ObjectId(id));

    session = await ExaminationSession.create({
      examinationId: exam._id,
      slotId: slot._id,
      studentId,
      startedAt: now,
      deadline,
      status: 'active',
      drafts: {},
      assignedQuestions: assignedQuestionIds,
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent']
    });

    registration.status = 'attended';
    await registration.save();

    await logAudit(
      'EXAM_SESSION_STARTED',
      { sessionId: session._id, examinationId: exam._id, studentId, deadline },
      req
    );

    return res.status(201).json({
      success: true,
      sessionId: session._id,
      deadline,
      durationMinutes: exam.durationMinutes
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to start examination', error: error.message });
  }
}

export async function getSessionData(req: AuthRequest, res: Response) {
  try {
    const { sessionId } = req.params;
    const studentId = req.userId!;

    const session = await ExaminationSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Check authorization: must be session owner or admin/faculty
    if (session.studentId.toString() !== studentId && req.user?.role === 'student') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to examination session.' });
    }

    const exam = await Examination.findById(session.examinationId).populate('languageId');
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Associated examination not found.' });
    }

    // Check auto-expiry on server
    const now = Date.now();
    const remainingSeconds = Math.max(0, Math.floor((session.deadline.getTime() - now) / 1000));

    if (remainingSeconds <= 0 && session.status === 'active') {
      await ProgressionService.finalizeExamSession(session._id.toString(), req);
      session.status = 'expired';
      await session.save();
    }

    // Load permitted questions with public test cases only
    // Use session-specific assigned shuffled questions if available, falling back to exam.questions
    const targetQuestionIds =
      session.assignedQuestions && session.assignedQuestions.length > 0
        ? session.assignedQuestions
        : exam.questions;

    const questions = await Question.find({ _id: { $in: targetQuestionIds } }).lean();
    const questionMap = new Map<string, any>(questions.map((q: any) => [q._id.toString(), q]));
    const orderedQuestions = targetQuestionIds
      .map((id: any) => questionMap.get(id.toString()))
      .filter(Boolean);

    const sanitizedQuestions = await Promise.all(
      orderedQuestions.map(async (q: any) => {
        // Fetch only public test cases (Hidden test cases are NEVER returned to student)
        const publicTestCases = await TestCase.find({ questionId: q._id, isHidden: false })
          .select('input expectedOutput isHidden weight order')
          .sort({ order: 1 })
          .lean();

        return {
          id: q._id,
          title: q.title,
          description: q.description,
          inputFormat: q.inputFormat,
          outputFormat: q.outputFormat,
          constraints: q.constraints,
          examples: q.examples,
          difficulty: q.difficulty,
          marks: q.marks,
          allowedLanguages: q.allowedLanguages && q.allowedLanguages.length > 0 ? q.allowedLanguages : exam.allowedLanguages,
          publicTestCases
        };
      })
    );

    return res.json({
      success: true,
      session: {
        id: session._id,
        status: session.status,
        startedAt: session.startedAt,
        deadline: session.deadline,
        remainingSeconds,
        drafts: session.drafts
      },
      exam: {
        id: exam._id,
        title: exam.title,
        description: exam.description,
        language: (exam.languageId as any)?.name,
        languageSlug: (exam.languageId as any)?.slug,
        levelNumber: exam.levelNumber,
        passingPercentage: exam.passingPercentage,
        instructions: exam.instructions
      },
      questions: sanitizedQuestions
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error retrieving session', error: error.message });
  }
}

export async function saveDraft(req: AuthRequest, res: Response) {
  try {
    const { sessionId } = req.params;
    const { questionId, language, code } = req.body;
    const studentId = req.userId!;

    const session = await ExaminationSession.findById(sessionId);
    if (!session || session.studentId.toString() !== studentId) {
      return res.status(403).json({ success: false, message: 'Unauthorized session.' });
    }

    if (session.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Cannot save draft for completed session.' });
    }

    // Update draft map
    session.drafts.set(questionId, {
      code,
      language,
      updatedAt: new Date()
    });

    await session.save();
    return res.json({ success: true, savedAt: new Date() });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Draft save error', error: error.message });
  }
}

export async function runPublicCode(req: AuthRequest, res: Response) {
  try {
    const { sessionId } = req.params;
    const { questionId, language, code, customInput } = req.body;

    const session = await ExaminationSession.findById(sessionId);
    if (!session || session.studentId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized session.' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    let testCasesToRun: WorkerTestCaseInput[] = [];

    if (customInput !== undefined && customInput !== null && customInput.trim() !== '') {
      testCasesToRun = [
        {
          id: 'custom_1',
          input: customInput,
          expectedOutput: '',
          isHidden: false
        }
      ];
    } else {
      const publicCases = await TestCase.find({ questionId, isHidden: false });
      testCasesToRun = publicCases.map((tc) => ({
        id: tc._id.toString(),
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: false
      }));

      // If no explicit test cases in DB, use examples
      if (testCasesToRun.length === 0 && question.examples.length > 0) {
        testCasesToRun = question.examples.map((ex, idx) => ({
          id: `example_${idx + 1}`,
          input: ex.input,
          expectedOutput: ex.output,
          isHidden: false
        }));
      }
    }

    const executionResult = await executeCodeInWorker({
      language,
      code,
      testCases: testCasesToRun,
      timeLimitMs: question.timeLimitMs || 4000,
      memoryLimitMb: question.memoryLimitMb || 256
    });

    const primaryErrorLog = executionResult.errorLog || executionResult.compileOutput || (
      executionResult.testCaseResults.find((r) => !r.passed && r.errorMessage)?.errorMessage
    ) || executionResult.error;

    return res.json({
      success: true,
      result: {
        ...executionResult,
        errorLog: primaryErrorLog
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Code execution failure', error: error.message });
  }
}

export async function submitQuestionAnswer(req: AuthRequest, res: Response) {
  try {
    const { sessionId } = req.params;
    const { questionId, language, code } = req.body;
    const studentId = req.userId!;
    const now = Date.now();

    const session = await ExaminationSession.findById(sessionId);
    if (!session || session.studentId.toString() !== studentId) {
      return res.status(403).json({ success: false, message: 'Unauthorized session.' });
    }

    if (session.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Session is no longer active.' });
    }

    // Enforce server deadline (with 15s network latency buffer)
    if (now > session.deadline.getTime() + 15000) {
      session.status = 'expired';
      await session.save();
      await ProgressionService.finalizeExamSession(session._id.toString(), req);
      return res.status(400).json({ success: false, message: 'Examination time has expired. Submissions closed.' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Fetch ALL test cases (both public and hidden) for backend evaluation
    const allTestCases = await TestCase.find({ questionId }).sort({ order: 1 });
    let workerCases: WorkerTestCaseInput[] = allTestCases.map((tc) => ({
      id: tc._id.toString(),
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: tc.isHidden,
      weight: tc.weight
    }));

    if (workerCases.length === 0 && question.examples.length > 0) {
      workerCases = question.examples.map((ex, idx) => ({
        id: `ex_${idx + 1}`,
        input: ex.input,
        expectedOutput: ex.output,
        isHidden: false,
        weight: 1
      }));
    }

    const workerResult = await executeCodeInWorker({
      language,
      code,
      testCases: workerCases,
      timeLimitMs: question.timeLimitMs || 4000,
      memoryLimitMb: question.memoryLimitMb || 256
    });

    // Calculate score
    const totalWeight = workerCases.reduce((acc, c) => acc + (c.weight || 1), 0);
    let passedWeight = 0;

    const submissionTcResults = workerResult.testCaseResults.map((tcr) => {
      const originalCase = workerCases.find((c) => c.id === tcr.testCaseId);
      const isHidden = originalCase?.isHidden || false;
      const weight = originalCase?.weight || 1;

      if (tcr.passed) {
        passedWeight += weight;
      }

      return {
        testCaseId: (originalCase?.id && mongoose.Types.ObjectId.isValid(originalCase.id)
          ? new mongoose.Types.ObjectId(originalCase.id)
          : new mongoose.Types.ObjectId()) as any,
        passed: tcr.passed,
        actualOutput: isHidden ? undefined : (tcr.actualOutput ? tcr.actualOutput.slice(0, 1024) : undefined),
        expectedOutput: isHidden ? undefined : (tcr.expectedOutput ? tcr.expectedOutput.slice(0, 1024) : undefined),
        isHidden,
        executionTimeMs: tcr.executionTimeMs,
        status: tcr.status as any,
        errorMessage: isHidden ? undefined : (tcr.errorMessage ? tcr.errorMessage.slice(0, 1024) : undefined)
      };
    });

    const score = totalWeight > 0 ? Math.round((passedWeight / totalWeight) * question.marks) : 0;

    const submission = await Submission.create({
      sessionId: session._id,
      examinationId: session.examinationId,
      studentId,
      questionId: question._id,
      language,
      code: code ? code.slice(0, 50000) : '',
      verdict: workerResult.verdict,
      score,
      maxScore: question.marks,
      testCaseResults: submissionTcResults,
      compileOutput: workerResult.compileOutput ? workerResult.compileOutput.slice(0, 4096) : undefined,
      totalExecutionTimeMs: workerResult.totalExecutionTimeMs,
      submittedAt: new Date()
    });

    // Update draft to keep latest submitted code
    session.drafts.set(questionId, { code, language, updatedAt: new Date() });
    await session.save();

    await logAudit(
      'QUESTION_SUBMITTED',
      {
        sessionId: session._id,
        questionId: question._id,
        verdict: workerResult.verdict,
        score
      },
      req
    );

    // Return sanitized result to student (NEVER reveal hidden test contents)
    const sanitizedResults = submissionTcResults.map((r, idx) => ({
      index: idx + 1,
      passed: r.passed,
      status: r.status,
      executionTimeMs: r.executionTimeMs,
      isHidden: r.isHidden,
      // actualOutput and expectedOutput included ONLY if NOT hidden
      actualOutput: r.isHidden ? undefined : r.actualOutput,
      expectedOutput: r.isHidden ? undefined : r.expectedOutput,
      errorMessage: r.isHidden ? undefined : r.errorMessage
    }));

    const primaryErrorLog = workerResult.errorLog || workerResult.compileOutput || (
      submissionTcResults.find((r) => !r.passed && !r.isHidden && r.errorMessage)?.errorMessage
    ) || (
      submissionTcResults.find((r) => !r.passed && r.errorMessage)
        ? 'Runtime error encountered during test evaluation.'
        : undefined
    ) || workerResult.error;

    return res.json({
      success: true,
      submissionId: submission._id,
      verdict: workerResult.verdict,
      score,
      maxScore: question.marks,
      totalTests: workerResult.totalTests,
      passedTests: workerResult.passedTests,
      compileOutput: workerResult.compileOutput,
      errorLog: primaryErrorLog,
      testCaseResults: sanitizedResults
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Submission evaluation failed', error: error.message });
  }
}

export async function finalizeSession(req: AuthRequest, res: Response) {
  try {
    const { sessionId } = req.params;
    const studentId = req.userId!;

    const session = await ExaminationSession.findById(sessionId);
    if (!session || (session.studentId.toString() !== studentId && req.user?.role === 'student')) {
      return res.status(403).json({ success: false, message: 'Unauthorized session.' });
    }

    const { result, unlockedNextLevel, nextLevelNumber } =
      await ProgressionService.finalizeExamSession(session._id.toString(), req);

    return res.json({
      success: true,
      message: 'Examination successfully submitted and evaluated.',
      result,
      unlockedNextLevel,
      nextLevelNumber
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Finalization error', error: error.message });
  }
}

/**
 * Finalizes an examination session with student feedback and strictly verified faculty OTP.
 * The OTP must be generated by faculty and valid within the 20-second window.
 */
export async function finalizeSessionWithFeedback(req: AuthRequest, res: Response) {
  try {
    const { sessionId } = req.params;
    const { otp, rating, difficulty, comments } = req.body;
    const studentId = req.userId!;

    const session = await ExaminationSession.findById(sessionId);
    if (!session || (session.studentId.toString() !== studentId && req.user?.role === 'student')) {
      return res.status(403).json({ success: false, message: 'Unauthorized session.' });
    }

    if (!otp || typeof otp !== 'string' || otp.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Submission OTP is required. Please ask your lab faculty invigilator to generate your 20-second OTP.'
      });
    }

    const cleanOtp = otp.trim();

    // Verify OTP: can be used by all students or student-specific, matching the 6-digit code
    const otpRecord = await SubmissionOtp.findOne({
      otp: cleanOtp,
      $or: [
        { studentId: session.studentId },
        { studentId: { $exists: false } },
        { studentId: null }
      ]
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        invalid: true,
        message: 'Invalid submission OTP. Please verify the 6-digit code or ask your faculty to generate a new OTP.'
      });
    }

    const now = Date.now();
    // Enforce strict 20-second validity window
    if (now > otpRecord.expiresAt.getTime()) {
      return res.status(400).json({
        success: false,
        expired: true,
        message: 'OTP has expired! The 20-second validity window has passed. Please ask your faculty invigilator to click Generate OTP again.'
      });
    }

    // Record session into usedBySessions so multiple students can use the same OTP within 20s
    if (!otpRecord.usedBySessions) otpRecord.usedBySessions = [];
    if (!otpRecord.usedBySessions.some((id) => id.toString() === session._id.toString())) {
      otpRecord.usedBySessions.push(session._id);
      await otpRecord.save();
    }

    // Save student feedback
    session.feedback = {
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      difficulty: ['easy', 'moderate', 'hard', 'very_hard'].includes(difficulty) ? difficulty : 'moderate',
      comments: typeof comments === 'string' ? comments.trim() : '',
      submittedAt: new Date(),
      verifiedOtp: cleanOtp,
      verifiedByFaculty: otpRecord.generatedBy
    };
    await session.save();

    // Finalize exam session and calculate results
    const { result, unlockedNextLevel, nextLevelNumber } =
      await ProgressionService.finalizeExamSession(session._id.toString(), req);

    await logAudit(
      'SESSION_FINALIZED_WITH_FACULTY_OTP',
      {
        sessionId: session._id,
        studentId: session.studentId,
        verifiedByFaculty: otpRecord.generatedBy,
        rating: session.feedback.rating,
        difficulty: session.feedback.difficulty
      },
      req
    );

    return res.json({
      success: true,
      message: 'Examination successfully finalized with faculty verification and feedback.',
      result,
      unlockedNextLevel,
      nextLevelNumber
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Finalization error', error: error.message });
  }
}

export async function getSessionResult(req: AuthRequest, res: Response) {
  try {
    const { sessionId } = req.params;
    const studentId = req.userId!;

    const session = await ExaminationSession.findById(sessionId);
    if (!session || (session.studentId.toString() !== studentId && req.user?.role === 'student')) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const result = await ExaminationResult.findOne({ sessionId: session._id })
      .populate({
        path: 'examinationId',
        populate: { path: 'languageId' }
      })
      .populate('submissions');

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not yet generated for this session.' });
    }

    return res.json({ success: true, result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Result lookup error', error: error.message });
  }
}

export async function getExamAttendanceStatus(req: AuthRequest, res: Response) {
  try {
    const { id: examinationId } = req.params;
    const studentId = req.userId!;

    const registration = await ExaminationRegistration.findOne({
      examinationId,
      studentId,
      status: 'registered'
    }).populate('slotId');

    if (!registration) {
      return res.json({
        success: true,
        hasRegistration: false,
        attendanceStatus: 'none',
        message: 'No active registration for this examination.'
      });
    }

    const slot: any = registration.slotId;

    const existingSession = await ExaminationSession.findOne({
      examinationId,
      studentId,
      status: 'active'
    });

    return res.json({
      success: true,
      hasRegistration: true,
      attendanceStatus: registration.attendanceStatus,
      markedPresentAt: registration.markedPresentAt,
      hasActiveSession: !!existingSession,
      activeSessionId: existingSession?._id,
      slot: slot
        ? {
            id: slot._id,
            slotName: slot.slotName,
            labName: slot.labName,
            timeWindow: slot.timeWindow,
            startTime: slot.startTime,
            endTime: slot.endTime
          }
        : null
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch attendance status', error: error.message });
  }
}

/**
 * Proctoring Anti-Cheating Gate:
 * Immediately terminates an examination session when tab switching / window blur violation is detected.
 */
export async function terminateSessionOnTabSwitch(req: AuthRequest, res: Response) {
  try {
    const { sessionId } = req.params;
    const studentId = req.userId!;

    const session = await ExaminationSession.findById(sessionId);
    if (!session || (session.studentId.toString() !== studentId && req.user?.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Unauthorized examination session.' });
    }

    if (session.status === 'active') {
      session.status = 'terminated';
      session.finishedAt = new Date();
      await session.save();

      await logAudit(
        'EXAM_SESSION_TERMINATED_TAB_SWITCH',
        {
          sessionId: session._id,
          studentId,
          examinationId: session.examinationId,
          reason: 'Proctoring violation: Student switched browser tab / window focus lost'
        },
        req
      );

      // Finalize session so score is computed from submitted problems up to this point
      await ProgressionService.finalizeExamSession(session._id.toString(), req);
    }

    return res.json({
      success: true,
      message: 'Examination session terminated due to tab switch violation.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Termination error', error: error.message });
  }
}

