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
    const progressByLanguage = await ProgressionService.getStudentLanguagesProgress(studentId);

    const courses = progressByLanguage.map((prog) => {
      const completedLevels = prog.levels.filter((l) => l.status === 'Passed').length;
      return {
        languageId: prog.languageId,
        languageName: prog.languageName,
        slug: prog.slug,
        totalLevels: prog.totalLevels,
        completedLevels,
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
 * Returns courses the student is enrolled in and how many courses currently registered for an exam.
 */
export async function getMyCourses(req: AuthRequest, res: Response) {
  try {
    const studentId = req.userId!;
    const [progressByLanguage, activeRegistrations] = await Promise.all([
      ProgressionService.getStudentLanguagesProgress(studentId),
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

    const courses = progressByLanguage.map((prog) => {
      const completedLevels = prog.levels.filter((l) => l.status === 'Passed').length;
      const registeredLevels = prog.levels.filter((l) => l.status === 'Registered').length;
      return {
        languageId: prog.languageId,
        languageName: prog.languageName,
        slug: prog.slug,
        totalLevels: prog.totalLevels,
        completedLevels,
        registeredLevels,
        highestUnlockedLevel: prog.highestUnlockedLevel,
        levels: prog.levels
      };
    });

    return res.json({
      success: true,
      currentlyRegisteredCount: registeredExams.length,
      registeredExams,
      courses
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

    // Lookup language by ObjectId or slug
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

    // Curriculum & Video data
    const curriculum = getLevelCurriculum(language.slug, levelNumber, language.name);

    // Verify eligibility
    const eligibility = await ProgressionService.verifyEligibility(
      studentId,
      language._id.toString(),
      levelNumber
    );

    // Check if student passed this level
    const progress = await ProgressionService.getOrCreateProgress(studentId, language._id);
    const passedRecord = progress.completedLevels.find((c) => c.levelNumber === levelNumber);
    const isPassed = !!passedRecord;

    // Check if student already registered for this exam level
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

    // Lookup published examination for this language & level
    const exam = await Examination.findOne({
      languageId: language._id,
      levelNumber,
      isPublished: true
    }).populate('questions', 'title difficulty maxScore timeLimitSeconds');

    let examData = null;
    if (exam) {
      const now = new Date();
      // Registration rule: unlocks at previous day 9:00 PM
      const isRegistrationOpen = now >= exam.registrationStartDate;

      // Real-time slot fetching: ONLY unfilled slots (registeredCount < capacity)
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
