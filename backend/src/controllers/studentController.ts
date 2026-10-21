import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { StudentProfile } from '../models/StudentProfile';
import { ExaminationRegistration } from '../models/ExaminationRegistration';
import { ExaminationResult } from '../models/ExaminationResult';
import { Notification } from '../models/Notification';
import { ProgrammingLanguage } from '../models/ProgrammingLanguage';
import { ProgrammingLevel } from '../models/ProgrammingLevel';
import { Examination } from '../models/Examination';
import { ExaminationSlot } from '../models/ExaminationSlot';
import { ExaminationSession } from '../models/ExaminationSession';
import { StudentProgress } from '../models/StudentProgress';
import { ProgressionService } from '../services/ProgressionService';
import { getLevelCurriculum } from '../data/courseCurriculum';
import { isSlotStartedOrPassed, isSlotConcluded, isSlotLiveNow, getOrCreateTomorrowExam, resolveActiveExamAndSlots } from '../services/SlotTimingService';

export async function getStudentDashboard(req: AuthRequest, res: Response) {
  try {
    const studentId = req.userId!;
    const user = req.user!;

    const [profile, progressByLanguage, registrations, recentResults, notifications] =
      await Promise.all([
        StudentProfile.findOne({ userId: studentId }),
        ProgressionService.getStudentLanguagesProgress(studentId),
        ExaminationRegistration.find({ studentId, status: { $in: ['registered', 'attended'] } })
          .populate({
            path: 'examinationId',
            populate: { path: 'languageId' }
          })
          .populate('slotId')
          .sort({ createdAt: -1 }),
        ExaminationResult.find({ studentId })
          .populate({
            path: 'examinationId',
            populate: { path: 'languageId' }
          })
          .sort({ verifiedAt: -1 })
          .limit(10),
        Notification.find({ userId: studentId }).sort({ createdAt: -1 }).limit(15)
      ]);

    return res.json({
      success: true,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        studentId: user.studentId || profile?.studentId || 'N/A',
        department: profile?.department || 'Computer Science',
        batch: profile?.batch || '2022-2026',
        semester: profile?.semester || 6,
        enrollmentNumber: profile?.enrollmentNumber || 'N/A'
      },
      progressByLanguage,
      registrations,
      recentResults,
      notifications
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to load dashboard data', error: error.message });
  }
}

/**
 * Returns all courses with the number of levels completed in each course.
 */
export async function getTotalCourses(req: AuthRequest, res: Response) {
  try {
    const studentId = req.userId!;
    const [progressByLanguage, progressDocs] = await Promise.all([
      ProgressionService.getStudentLanguagesProgress(studentId),
      StudentProgress.find({ studentId })
    ]);

    const courses = progressByLanguage.map((prog) => {
      const completedLevels = prog.levels.filter((l) => l.status === 'Passed').length;
      const doc = progressDocs.find((p) => p.languageId.toString() === prog.languageId);
      const isEnrolled = !!(doc && (doc.isEnrolled || (doc.enrolledLevels && doc.enrolledLevels.length > 0)));

      return {
        languageId: prog.languageId,
        languageName: prog.languageName,
        slug: prog.slug,
        totalLevels: prog.totalLevels,
        completedLevels,
        isEnrolled,
        enrolledLevels: doc?.enrolledLevels || [],
        highestUnlockedLevel: prog.highestUnlockedLevel,
        levels: prog.levels
      };
    });

    const totalLevelsAcrossCourses = courses.reduce((sum, c) => sum + c.totalLevels, 0);
    const totalLevelsCompleted = courses.reduce((sum, c) => sum + c.completedLevels, 0);

    return res.json({
      success: true,
      totalCoursesCount: courses.length,
      totalLevelsAcrossCourses,
      totalLevelsCompleted,
      courses
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch total courses', error: error.message });
  }
}

/**
 * Returns detailed overview for a specific course (e.g. C):
 * Shows how many levels one by one, topics for each level, attempts taken, and registration status.
 */
export async function getCourseOverview(req: AuthRequest, res: Response) {
  try {
    const studentId = req.userId!;
    const { languageSlug } = req.params;

    const language = await ProgrammingLanguage.findOne({ slug: languageSlug.toLowerCase() });
    if (!language) {
      return res.status(404).json({ success: false, message: 'Programming course not found' });
    }

    const progress = await ProgressionService.getOrCreateProgress(studentId, language._id);

    // Get all past results for this student and language to calculate attempts and scores
    const results = await ExaminationResult.find({ studentId, languageId: language._id });

    // Also get active exam registrations for this student and language
    const registrations = await ExaminationRegistration.find({
      studentId,
      status: { $in: ['registered', 'attended'] }
    }).populate('examinationId');

    const enrolledLevelsSet = new Set<number>(progress.enrolledLevels || []);

    const levels = [];
    for (let lvl = 1; lvl <= language.totalLevels; lvl++) {
      const curriculum = getLevelCurriculum(language.slug, lvl, language.name);

      // Attempts count for this level
      const levelResults = results.filter((r) => r.levelNumber === lvl);
      const attemptsCount = levelResults.length;
      const bestScore = levelResults.length > 0 ? Math.max(...levelResults.map((r) => r.percentage)) : undefined;

      const isPassed = progress.completedLevels.some((c) => c.levelNumber === lvl);
      const isEnrolled = enrolledLevelsSet.has(lvl);
      const isEligible = lvl === 1 || progress.completedLevels.some((c) => c.levelNumber === lvl - 1);
      const lockReason = !isEligible ? `Requires passing Level ${lvl - 1} first.` : undefined;

      // Active examination registration for this level if any
      const matchingReg = registrations.find(
        (r: any) =>
          r.examinationId?.languageId?.toString() === language._id.toString() &&
          r.examinationId?.levelNumber === lvl
      );

      levels.push({
        levelNumber: lvl,
        title: curriculum.title,
        description: curriculum.description,
        topics: curriculum.topics,
        studyNotes: curriculum.studyNotes,
        videosCount: curriculum.videos.length,
        attemptsCount,
        bestScore,
        isPassed,
        isEnrolled,
        isEligible,
        lockReason,
        isRegisteredForExam: !!matchingReg,
        attendanceStatus: matchingReg?.attendanceStatus || null,
        isAbsent: matchingReg?.attendanceStatus === 'absent'
      });
    }

    const completedLevelsCount = levels.filter((l) => l.isPassed).length;

    return res.json({
      success: true,
      language: {
        _id: language._id,
        name: language.name,
        slug: language.slug,
        description: language.description,
        totalLevels: language.totalLevels
      },
      isCourseEnrolled: progress.isEnrolled,
      completedLevelsCount,
      highestUnlockedLevel: progress.highestUnlockedLevel,
      levels
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch course overview', error: error.message });
  }
}

/**
 * Registers / Enrolls student in a course level from the course overview page.
 * Once registered, the level appears in "My Courses".
 */
export async function registerCourseLevel(req: AuthRequest, res: Response) {
  try {
    const studentId = req.userId!;
    const { languageSlug } = req.params;
    const { levelNumber } = req.body;

    const lvl = parseInt(levelNumber, 10);
    if (isNaN(lvl) || lvl < 1) {
      return res.status(400).json({ success: false, message: 'Valid level number is required' });
    }

    const language = await ProgrammingLanguage.findOne({ slug: languageSlug.toLowerCase() });
    if (!language) {
      return res.status(404).json({ success: false, message: 'Programming course not found' });
    }

    if (lvl > language.totalLevels) {
      return res.status(400).json({ success: false, message: `Course only has ${language.totalLevels} levels` });
    }

    const progress = await ProgressionService.getOrCreateProgress(studentId, language._id);

    // Verify prerequisite: Level 1 has no prerequisite. Level N requires level N - 1 passed
    if (lvl > 1) {
      const prevPassed = progress.completedLevels.some((c) => c.levelNumber === lvl - 1);
      if (!prevPassed) {
        return res.status(403).json({
          success: false,
          message: `Cannot register for Level ${lvl}. You must pass Level ${lvl - 1} first.`
        });
      }
    }

    // Verify absent rule: If student was absent, admin must remove that course before student can register again
    const examForLevel = await Examination.findOne({
      languageId: language._id,
      levelNumber: lvl
    });

    if (examForLevel) {
      const absentReg = await ExaminationRegistration.findOne({
        examinationId: examForLevel._id,
        studentId,
        attendanceStatus: 'absent'
      });

      if (absentReg) {
        return res.status(400).json({
          success: false,
          message: `You were marked absent for ${language.name} Level ${lvl}. Only an administrator or staff can remove this course from your My Courses before you can register again.`
        });
      }
    }

    if (!progress.enrolledLevels) {
      progress.enrolledLevels = [];
    }

    if (!progress.enrolledLevels.includes(lvl)) {
      progress.enrolledLevels.push(lvl);
    }
    progress.isEnrolled = true;
    if (!progress.enrolledAt) {
      progress.enrolledAt = new Date();
    }

    await progress.save();

    await Notification.create({
      userId: studentId,
      title: `Registered: ${language.name} Level ${lvl}`,
      message: `You have registered for ${language.name} Level ${lvl}. This level is now active under My Courses where you can book examination slots.`,
      type: 'registration'
    });

    return res.json({
      success: true,
      message: `Successfully registered for ${language.name} Level ${lvl}! It is now visible in My Courses.`,
      enrolledLevels: progress.enrolledLevels
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to register for course level', error: error.message });
  }
}

/**
 * Returns courses the student has registered for.
 * Strict rule: If the student registered the course/level, then ONLY does it appear on My Courses.
 */
export async function getMyCourses(req: AuthRequest, res: Response) {
  try {
    const studentId = req.userId!;
    const [progressByLanguage, progressDocs, activeRegistrations] = await Promise.all([
      ProgressionService.getStudentLanguagesProgress(studentId),
      StudentProgress.find({ studentId }),
      ExaminationRegistration.find({
        studentId,
        status: { $in: ['registered', 'attended'] }
      })
        .populate({
          path: 'examinationId',
          populate: { path: 'languageId' }
        })
        .populate('slotId')
        .sort({ createdAt: -1 })
    ]);

    const registeredExams = activeRegistrations.map((reg: any) => ({
      registrationId: reg._id,
      examId: reg.examinationId?._id,
      examTitle: reg.examinationId?.title,
      languageId: reg.examinationId?.languageId?._id || reg.examinationId?.languageId,
      languageName: reg.examinationId?.languageId?.name,
      levelNumber: reg.examinationId?.levelNumber,
      examDate: reg.examinationId?.examDate,
      durationMinutes: reg.examinationId?.durationMinutes,
      status: reg.status,
      attendanceStatus: reg.attendanceStatus || 'pending',
      markedPresentAt: reg.markedPresentAt,
      slot: reg.slotId
        ? {
            slotId: reg.slotId._id,
            slotNumber: reg.slotId.slotNumber,
            timeWindow: reg.slotId.timeWindow || reg.slotId.slotName || `${new Date(reg.slotId.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(reg.slotId.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            labName: reg.slotId.labName || 'Standard Lab',
            capacity: reg.slotId.capacity,
            registeredCount: reg.slotId.registeredCount,
            startTime: reg.slotId.startTime,
            endTime: reg.slotId.endTime
          }
        : null
    }));

    // Filter courses strictly: only include courses where student registered for at least one level
    const enrolledCourses: any[] = [];

    for (const prog of progressByLanguage) {
      const doc = progressDocs.find((p) => p.languageId.toString() === prog.languageId);
      const enrolledLevelsSet = new Set<number>(doc?.enrolledLevels || []);

      // Also include any level with an active exam registration
      activeRegistrations.forEach((r: any) => {
        if (
          r.examinationId?.languageId?._id?.toString() === prog.languageId &&
          r.examinationId?.levelNumber
        ) {
          enrolledLevelsSet.add(r.examinationId.levelNumber);
        }
      });

      // Rule: If the student completed the level (passed) or attended but failed,
      // it MUST BE REMOVED from My Courses.
      // ONLY the ongoing course levels and not attended (absent) must be shown in My Courses!
      const completedLevelsSet = new Set<number>(
        (doc?.completedLevels || []).map((c: any) => c.levelNumber)
      );

      // Remove completed levels from the enrolled set
      completedLevelsSet.forEach((lvlNum) => {
        enrolledLevelsSet.delete(lvlNum);
      });

      // Filter levels in this course strictly to ongoing or absent levels (NOT passed, NOT failed)
      const ongoingOrAbsentLevels = prog.levels.filter((lvl) => {
        // If completed/passed, remove from My Courses
        if (lvl.status === 'Passed' || completedLevelsSet.has(lvl.levelNumber)) {
          return false;
        }
        // If failed, remove from My Courses
        if (lvl.status === 'Failed') {
          return false;
        }
        // Must be in enrolledLevelsSet
        return enrolledLevelsSet.has(lvl.levelNumber);
      });

      // If student has any ongoing or absent levels in this course:
      if (ongoingOrAbsentLevels.length > 0) {
        const completedLevels = completedLevelsSet.size;

        enrolledCourses.push({
          languageId: prog.languageId,
          languageName: prog.languageName,
          slug: prog.slug,
          totalLevels: prog.totalLevels,
          completedLevels,
          registeredLevels: ongoingOrAbsentLevels.length,
          highestUnlockedLevel: prog.highestUnlockedLevel,
          levels: ongoingOrAbsentLevels
        });
      }
    }

    return res.json({
      success: true,
      currentlyRegisteredCount: registeredExams.length,
      registeredExams,
      courses: enrolledCourses
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch my courses', error: error.message });
  }
}

/**
 * Returns full level details: videos, curriculum, eligibility, active registration,
 * and if an exam is open, the real-time available slots for slot selection dropdown.
 */
export async function getLevelDetail(req: AuthRequest, res: Response) {
  try {
    const studentId = req.userId!;
    const { languageId, levelNumber: levelStr } = req.params;
    const levelNumber = parseInt(levelStr, 10);

    if (isNaN(levelNumber) || levelNumber < 1) {
      return res.status(400).json({ success: false, message: 'Invalid level number' });
    }

    let language;
    if (mongoose.Types.ObjectId.isValid(languageId)) {
      language = await ProgrammingLanguage.findById(languageId);
    }
    if (!language) {
      language = await ProgrammingLanguage.findOne({ slug: languageId.toLowerCase() });
    }

    if (!language) {
      return res.status(404).json({ success: false, message: 'Language course not found' });
    }

    const curriculum = getLevelCurriculum(language.slug, levelNumber, language.name);

    const eligibility = await ProgressionService.verifyEligibility(
      studentId,
      language._id.toString(),
      levelNumber
    );

    const progress = await ProgressionService.getOrCreateProgress(studentId, language._id);
    const passedRecord = progress.completedLevels.find((c) => c.levelNumber === levelNumber);
    const isPassed = !!passedRecord;
    const exam = await Examination.findOne({
      languageId: language._id,
      levelNumber,
      isPublished: true
    }).populate('questions', 'title difficulty maxScore timeLimitSeconds');

    // Find all examination IDs for this language and level
    const matchingExams = await Examination.find({
      languageId: language._id,
      levelNumber
    }).select('_id');
    const examIds = matchingExams.map((e) => e._id);

    // Find if the student has booked a slot for this course level
    let existingRegistration = await ExaminationRegistration.findOne({
      studentId,
      examinationId: { $in: examIds },
      status: { $in: ['registered', 'attended'] }
    })
      .populate('examinationId')
      .populate('slotId');

    // Fallback: search all active registrations of student and match language and level
    if (!existingRegistration) {
      const allActive = await ExaminationRegistration.find({
        studentId,
        status: { $in: ['registered', 'attended'] }
      })
        .populate('examinationId')
        .populate('slotId');

      for (const reg of allActive) {
        const regExam = reg.examinationId as any;
        if (
          regExam &&
          regExam.languageId &&
          (regExam.languageId.toString() === language._id.toString() ||
            regExam.languageId._id?.toString() === language._id.toString()) &&
          Number(regExam.levelNumber) === Number(levelNumber)
        ) {
          existingRegistration = reg;
          break;
        }
      }
    }

    const hasActiveRegistration = !!existingRegistration;

    // Resolve slot data
    let slotData: any = null;
    if (existingRegistration) {
      if (existingRegistration.slotId && (existingRegistration.slotId as any).timeWindow) {
        slotData = existingRegistration.slotId;
      } else if (existingRegistration.slotId) {
        slotData = await ExaminationSlot.findById(existingRegistration.slotId);
      }
    }

    const now = new Date();

    // If student booked a slot and the 1-hour slot period has concluded without being marked present, auto-mark absent
    if (existingRegistration && slotData) {
      const concluded = isSlotConcluded(slotData, now);
      if (concluded && existingRegistration.attendanceStatus === 'pending') {
        existingRegistration.attendanceStatus = 'absent';
        await existingRegistration.save();
      }
    }

    let activeExam: any = null;
    let isRegistrationOpen = false;
    let availableSlots: any[] = [];

    if (existingRegistration) {
      activeExam = existingRegistration.examinationId;
      isRegistrationOpen = false;
      availableSlots = [];
    } else {
      const resolved = await resolveActiveExamAndSlots(language._id, levelNumber, now);
      activeExam = resolved.activeExam;
      isRegistrationOpen = resolved.isRegistrationOpen;
      availableSlots = resolved.availableSlots || [];
    }

    let examData = null;
    if (activeExam) {
      examData = {
        _id: activeExam._id,
        title: activeExam.title,
        description: activeExam.description,
        durationMinutes: activeExam.durationMinutes,
        passingPercentage: activeExam.passingPercentage,
        examDate: activeExam.examDate,
        registrationStartDate: activeExam.registrationStartDate,
        registrationEndDate: activeExam.registrationEndDate,
        isRegistrationOpen,
        instructions: activeExam.instructions,
        questionsCount: activeExam.questions ? activeExam.questions.length : 2,
        slots: availableSlots.map((s: any) => ({
          _id: s._id,
          slotNumber: s.slotNumber,
          labName: s.labName,
          timeWindow: s.timeWindow,
          capacity: s.capacity,
          registeredCount: s.registeredCount,
          seatsRemaining: Math.max(0, s.capacity - s.registeredCount),
          startTime: s.startTime,
          endTime: s.endTime
        }))
      };
    }

    // Query student's slot booking history
    const allStudentRegistrations = await ExaminationRegistration.find({
      studentId
    })
      .populate({
        path: 'examinationId',
        populate: { path: 'languageId' }
      })
      .populate('slotId')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      language: {
        _id: language._id,
        name: language.name,
        slug: language.slug,
        description: language.description,
        totalLevels: language.totalLevels
      },
      levelNumber,
      curriculum,
      progress: {
        isEligible: eligibility.isEligible,
        lockReason: eligibility.reason,
        isPassed,
        scorePercentage: passedRecord?.percentage,
        isRegistered: hasActiveRegistration
      },
      registration: hasActiveRegistration
        ? {
            registrationId: existingRegistration!._id,
            attendanceStatus: existingRegistration!.attendanceStatus || 'pending',
            markedPresentAt: existingRegistration!.markedPresentAt,
            slot: slotData
              ? {
                  _id: slotData._id,
                  slotNumber: slotData.slotNumber || 1,
                  labName: slotData.labName || 'Standard Lab',
                  timeWindow: slotData.timeWindow || slotData.slotName || 'Collegiate Window',
                  capacity: slotData.capacity || 30,
                  startTime: slotData.startTime,
                  endTime: slotData.endTime
                }
              : null
          }
        : null,
      examination: examData,
      slotHistory: allStudentRegistrations.map((r: any) => ({
        registrationId: r._id,
        examId: r.examinationId?._id,
        examTitle: r.examinationId?.title || `${language.name} Level ${r.examinationId?.levelNumber || levelNumber}`,
        languageName: r.examinationId?.languageId?.name || language.name,
        languageSlug: r.examinationId?.languageId?.slug || language.slug,
        levelNumber: r.examinationId?.levelNumber || levelNumber,
        slotTiming: r.slotId?.timeWindow || r.slotId?.slotName || 'Collegiate Window',
        labName: r.slotId?.labName || 'Standard Lab',
        registeredAt: r.registeredAt || r.createdAt,
        status: r.status,
        attendanceStatus: r.attendanceStatus || 'pending',
        markedPresentAt: r.markedPresentAt
      }))
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch level details', error: error.message });
  }
}

/**
 * Returns complete slot booking history for the logged-in student, including
 * slot timing, assigned lab, attendance gate status, and previous marks.
 */
export async function getSlotHistory(req: AuthRequest, res: Response) {
  try {
    const studentId = req.userId!;

    const [registrations, results, sessions, progresses] = await Promise.all([
      ExaminationRegistration.find({ studentId })
        .populate({
          path: 'examinationId',
          populate: { path: 'languageId' }
        })
        .populate('slotId')
        .sort({ createdAt: -1 })
        .lean(),
      ExaminationResult.find({ studentId }).sort({ createdAt: -1 }).lean(),
      ExaminationSession.find({ studentId })
        .populate({
          path: 'examinationId',
          populate: { path: 'languageId' }
        })
        .populate('slotId')
        .sort({ createdAt: -1 })
        .lean(),
      StudentProgress.find({ studentId }).lean()
    ]);

    const usedSessionIds = new Set<string>();
    const history: any[] = [];

    // 1. Process active/recorded registrations
    for (const r of registrations as any[]) {
      const examIdStr = r.examinationId?._id ? r.examinationId._id.toString() : null;
      const langIdStr = r.examinationId?.languageId?._id ? r.examinationId.languageId._id.toString() : null;
      const levelNum = r.examinationId?.levelNumber;

      // Mark ALL matching sessions as used so they don't produce duplicate entries
      const matchingSessions = (sessions as any[]).filter((s: any) =>
        (examIdStr && s.examinationId?._id?.toString() === examIdStr) ||
        (r.slotId?._id && s.slotId?._id?.toString() === r.slotId._id.toString())
      );
      matchingSessions.forEach((s: any) => usedSessionIds.add(s._id.toString()));

      const matchedSession: any = matchingSessions[0];

      let matchedResult: any = results.find((res: any) =>
        (matchingSessions.some((s: any) => res.sessionId?.toString() === s._id.toString())) ||
        (examIdStr && res.examinationId?.toString() === examIdStr) ||
        (langIdStr && res.languageId?.toString() === langIdStr && res.levelNumber === levelNum)
      );

      let progressScore: number | null = null;
      let progressPassed = false;
      let progressPassedAt: Date | null = null;
      if (langIdStr) {
        const langProgress: any = progresses.find((p: any) => p.languageId?.toString() === langIdStr);
        if (langProgress && Array.isArray(langProgress.completedLevels)) {
          const comp: any = langProgress.completedLevels.find((c: any) => c.levelNumber === levelNum);
          if (comp) {
            progressScore = comp.obtainedMarks ?? comp.percentage ?? null;
            progressPassed = true;
            progressPassedAt = comp.passedAt || null;
          }
        }
      }

      let obtainedMarks: number | null = null;
      const totalMarks = 100;
      let percentage: number | null = null;
      let isPassed: boolean | null = null;
      let sessionId = matchedSession?._id ? matchedSession._id.toString() : null;
      let evaluatedAt: Date | null = null;

      if (matchedResult) {
        obtainedMarks = matchedResult.obtainedMarks;
        percentage = matchedResult.percentage;
        isPassed = matchedResult.passed;
        sessionId = matchedResult.sessionId ? matchedResult.sessionId.toString() : sessionId;
        evaluatedAt = matchedResult.verifiedAt || matchedResult.createdAt;
      } else if (progressPassed && progressScore !== null) {
        obtainedMarks = progressScore;
        percentage = progressScore;
        isPassed = true;
        evaluatedAt = progressPassedAt;
      }

      const examDate = r.examinationId?.examDate || r.slotId?.startTime || r.createdAt;
      const slotIdStr = r.slotId?._id ? r.slotId._id.toString() : (r.slotId ? r.slotId.toString() : null);

      history.push({
        registrationId: r._id.toString(),
        examId: examIdStr,
        examTitle: r.examinationId?.title || `${r.examinationId?.languageId?.name || 'Course'} Level ${levelNum || 1} Assessment`,
        languageId: langIdStr,
        languageName: r.examinationId?.languageId?.name || 'Programming Course',
        languageSlug: r.examinationId?.languageId?.slug,
        levelNumber: levelNum,
        slotId: slotIdStr,
        slotTiming: r.slotId?.timeWindow || r.slotId?.slotName || 'Collegiate Window',
        labName: r.slotId?.labName || 'Standard Lab',
        examDate,
        registeredAt: r.registeredAt || r.createdAt,
        status: r.status,
        attendanceStatus: r.attendanceStatus || (matchedSession ? 'present' : 'pending'),
        markedPresentAt: r.markedPresentAt || matchedSession?.startedAt,
        sessionStatus: matchedSession?.status || null,
        previousMarks: {
          hasResult: obtainedMarks !== null,
          obtainedMarks,
          totalMarks,
          percentage,
          passed: isPassed,
          sessionId,
          evaluatedAt
        }
      });
    }

    // 2. Add past examination sessions not already tied to an active registration
    for (const s of sessions as any[]) {
      if (usedSessionIds.has(s._id.toString())) continue;

      const exam = s.examinationId;
      const slot = s.slotId;
      const examIdStr = exam?._id ? exam._id.toString() : null;
      const langIdStr = exam?.languageId?._id ? exam.languageId._id.toString() : null;
      const levelNum = exam?.levelNumber;

      let matchedResult: any = results.find((res: any) =>
        res.sessionId?.toString() === s._id.toString() ||
        (examIdStr && res.examinationId?.toString() === examIdStr) ||
        (langIdStr && res.languageId?.toString() === langIdStr && res.levelNumber === levelNum)
      );

      let progressScore: number | null = null;
      let progressPassed = false;
      let progressPassedAt: Date | null = null;
      if (langIdStr) {
        const langProgress: any = progresses.find((p: any) => p.languageId?.toString() === langIdStr);
        if (langProgress && Array.isArray(langProgress.completedLevels)) {
          const comp: any = langProgress.completedLevels.find((c: any) => c.levelNumber === levelNum);
          if (comp) {
            progressScore = comp.obtainedMarks ?? comp.percentage ?? null;
            progressPassed = true;
            progressPassedAt = comp.passedAt || null;
          }
        }
      }

      let obtainedMarks: number | null = null;
      const totalMarks = 100;
      let percentage: number | null = null;
      let isPassed: boolean | null = null;
      let evaluatedAt: Date | null = null;

      if (matchedResult) {
        obtainedMarks = matchedResult.obtainedMarks;
        percentage = matchedResult.percentage;
        isPassed = matchedResult.passed;
        evaluatedAt = matchedResult.verifiedAt || matchedResult.createdAt;
      } else if (progressPassed && progressScore !== null) {
        obtainedMarks = progressScore;
        percentage = progressScore;
        isPassed = true;
        evaluatedAt = progressPassedAt;
      }

      const examDate = exam?.examDate || s.startedAt || s.createdAt;
      const slotIdStr = slot?._id ? slot._id.toString() : (slot ? slot.toString() : null);

      history.push({
        registrationId: `sess-${s._id}`,
        examId: examIdStr,
        examTitle: exam?.title || `${exam?.languageId?.name || 'Course'} Level ${levelNum || 1} Assessment`,
        languageId: langIdStr,
        languageName: exam?.languageId?.name || 'Programming Course',
        languageSlug: exam?.languageId?.slug,
        levelNumber: levelNum,
        slotId: slotIdStr,
        slotTiming: slot?.timeWindow || slot?.slotName || 'Collegiate Window',
        labName: slot?.labName || 'Standard Lab',
        examDate,
        registeredAt: s.startedAt || s.createdAt,
        status: s.status === 'submitted' ? 'attended' : s.status,
        attendanceStatus: 'present',
        markedPresentAt: s.startedAt,
        sessionStatus: s.status,
        previousMarks: {
          hasResult: obtainedMarks !== null,
          obtainedMarks,
          totalMarks,
          percentage,
          passed: isPassed,
          sessionId: s._id.toString(),
          evaluatedAt
        }
      });
    }

    // Sort by latest registration/session date
    history.sort((a, b) => new Date(b.registeredAt || b.examDate).getTime() - new Date(a.registeredAt || a.examDate).getTime());

    // 3. Strict Deduplication: Ensure each unique slot booking / exam session appears at most once
    const uniqueHistory: any[] = [];
    const seenBookingKeys = new Set<string>();

    for (const item of history) {
      const slotKey = item.slotId || (item.slotTiming && item.labName ? `${item.slotTiming}_${item.labName}` : null);
      const dateKey = item.examDate ? new Date(item.examDate).toISOString().split('T')[0] : 'nodate';
      const dedupeKey = item.examId && slotKey
        ? `${item.examId}_${slotKey}_${dateKey}`
        : `${item.languageId || 'lang'}_lvl${item.levelNumber}_${slotKey || 'noslot'}_${dateKey}`;

      if (!seenBookingKeys.has(dedupeKey)) {
        seenBookingKeys.add(dedupeKey);
        uniqueHistory.push(item);
      } else {
        // Merge into existing entry if current item has actual exam results
        const existing = uniqueHistory.find((h) => {
          const hSlotKey = h.slotId || (h.slotTiming && h.labName ? `${h.slotTiming}_${h.labName}` : null);
          const hDateKey = h.examDate ? new Date(h.examDate).toISOString().split('T')[0] : 'nodate';
          const hDedupeKey = h.examId && hSlotKey
            ? `${h.examId}_${hSlotKey}_${hDateKey}`
            : `${h.languageId || 'lang'}_lvl${h.levelNumber}_${hSlotKey || 'noslot'}_${hDateKey}`;
          return hDedupeKey === dedupeKey;
        });

        if (existing) {
          if (!existing.previousMarks?.hasResult && item.previousMarks?.hasResult) {
            existing.previousMarks = item.previousMarks;
            existing.status = item.status;
            existing.attendanceStatus = item.attendanceStatus;
            existing.markedPresentAt = item.markedPresentAt || existing.markedPresentAt;
          } else if (
            existing.previousMarks?.hasResult &&
            item.previousMarks?.hasResult &&
            (item.previousMarks.obtainedMarks ?? 0) > (existing.previousMarks.obtainedMarks ?? 0)
          ) {
            existing.previousMarks = item.previousMarks;
          }
        }
      }
    }

    // Aggregate summary metrics on deduplicated history
    const totalBookings = uniqueHistory.length;
    const completedAssessments = uniqueHistory.filter((h: any) => h.previousMarks.hasResult).length;
    const passedAssessments = uniqueHistory.filter((h: any) => h.previousMarks.passed === true).length;
    const scores = uniqueHistory
      .filter((h: any) => h.previousMarks.hasResult && typeof h.previousMarks.obtainedMarks === 'number')
      .map((h: any) => h.previousMarks.obtainedMarks);
    const highestScore = scores.length > 0 ? Math.max(...scores) : null;
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null;

    return res.json({
      success: true,
      summary: {
        totalBookings,
        completedAssessments,
        passedAssessments,
        highestScore,
        averageScore
      },
      slotHistory: uniqueHistory
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch slot history', error: error.message });
  }
}

export async function getNotifications(req: AuthRequest, res: Response) {
  try {
    const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json({ success: true, notifications });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
}

export async function markNotificationRead(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    await Notification.findOneAndUpdate({ _id: id, userId: req.userId }, { isRead: true });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error marking notification read', error: error.message });
  }
}
