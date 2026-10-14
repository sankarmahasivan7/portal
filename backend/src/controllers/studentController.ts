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
import { StudentProgress } from '../models/StudentProgress';
import { ProgressionService } from '../services/ProgressionService';
import { getLevelCurriculum } from '../data/courseCurriculum';

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
        isRegisteredForExam: !!matchingReg
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
      languageId: reg.examinationId?.languageId?._id,
      languageName: reg.examinationId?.languageId?.name,
      levelNumber: reg.examinationId?.levelNumber,
      examDate: reg.examinationId?.examDate,
      durationMinutes: reg.examinationId?.durationMinutes,
      status: reg.status,
      slot: reg.slotId
        ? {
            slotId: reg.slotId._id,
            slotNumber: reg.slotId.slotNumber,
            timeWindow: reg.slotId.timeWindow || `${new Date(reg.slotId.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(reg.slotId.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            labName: reg.slotId.labName,
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

      // If student has registered for any levels in this course:
      if (enrolledLevelsSet.size > 0) {
        // Filter levels in this course strictly to the registered levels
        const filteredLevels = prog.levels.filter((lvl) => enrolledLevelsSet.has(lvl.levelNumber));
        const completedLevels = prog.levels.filter((l) => l.status === 'Passed').length;

        enrolledCourses.push({
          languageId: prog.languageId,
          languageName: prog.languageName,
          slug: prog.slug,
          totalLevels: prog.totalLevels,
          completedLevels,
          registeredLevels: filteredLevels.length,
          highestUnlockedLevel: prog.highestUnlockedLevel,
          levels: filteredLevels
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

    const existingRegistration = await ExaminationRegistration.findOne({
      studentId,
      status: { $in: ['registered', 'attended'] }
    })
      .populate({
        path: 'examinationId',
        match: { languageId: language._id, levelNumber }
      })
      .populate('slotId');

    const hasActiveRegistration =
      existingRegistration && existingRegistration.examinationId ? true : false;

    const exam = await Examination.findOne({
      languageId: language._id,
      levelNumber,
      isPublished: true
    }).populate('questions', 'title difficulty maxScore timeLimitSeconds');

    let examData = null;
    if (exam) {
      const now = new Date();
      const isRegistrationOpen = now >= exam.registrationStartDate;

      let availableSlots: any[] = [];
      if (isRegistrationOpen) {
        availableSlots = await ExaminationSlot.find({
          examinationId: exam._id,
          isActive: true,
          $expr: { $lt: ['$registeredCount', '$capacity'] }
        }).sort({ slotNumber: 1, labName: 1 });
      }

      examData = {
        _id: exam._id,
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        passingPercentage: exam.passingPercentage,
        examDate: exam.examDate,
        registrationStartDate: exam.registrationStartDate,
        registrationEndDate: exam.registrationEndDate,
        isRegistrationOpen,
        instructions: exam.instructions,
        questionsCount: exam.questions.length,
        slots: availableSlots.map((s) => ({
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
            slot: existingRegistration!.slotId
          }
        : null,
      examination: examData
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch level details', error: error.message });
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
