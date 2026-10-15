import mongoose from 'mongoose';
import { StudentProgress, IStudentProgress } from '../models/StudentProgress';
import { ProgrammingLanguage } from '../models/ProgrammingLanguage';
import { Examination } from '../models/Examination';
import { ExaminationResult } from '../models/ExaminationResult';
import { ExaminationSession } from '../models/ExaminationSession';
import { ExaminationRegistration } from '../models/ExaminationRegistration';
import { Notification } from '../models/Notification';
import { logAudit } from './AuditService';

export interface LevelStatusInfo {
  levelNumber: number;
  status: 'Locked' | 'Available' | 'Registered' | 'In progress' | 'Submitted' | 'Passed' | 'Failed';
  lockReason?: string;
  passedAt?: Date;
  scorePercentage?: number;
  activeExamId?: string;
  activeSlotId?: string;
}

export interface LanguageProgressionSummary {
  languageId: string;
  languageName: string;
  slug: string;
  totalLevels: number;
  highestUnlockedLevel: number;
  levels: LevelStatusInfo[];
}

export class ProgressionService {
  /**
   * Retrieves or initializes student progress for a language.
   * If not found, initializes Level 1 as unlocked (Level 1 has no prerequisite).
   */
  public static async getOrCreateProgress(
    studentId: string | mongoose.Types.ObjectId,
    languageId: string | mongoose.Types.ObjectId
  ): Promise<IStudentProgress> {
    let progress = await StudentProgress.findOne({ studentId, languageId });
    if (!progress) {
      progress = await StudentProgress.create({
        studentId,
        languageId,
        highestUnlockedLevel: 1, // Level 1 is unlocked with no prerequisite
        completedLevels: []
      });
    }
    return progress;
  }

  /**
   * Verifies if a student is strictly eligible to take or register for an exam at level N.
   */
  public static async verifyEligibility(
    studentId: string,
    languageId: string,
    levelNumber: number
  ): Promise<{ isEligible: boolean; reason?: string }> {
    if (levelNumber === 1) {
      return { isEligible: true };
    }

    const progress = await this.getOrCreateProgress(studentId, languageId);

    // Rule: Level N requires Level N - 1 to be passed
    const prerequisiteLevel = levelNumber - 1;
    const hasPassedPrereq = progress.completedLevels.some(
      (c) => c.levelNumber === prerequisiteLevel
    );

    if (!hasPassedPrereq) {
      return {
        isEligible: false,
        reason: `Level ${levelNumber} is locked. You must successfully pass Level ${prerequisiteLevel} first.`
      };
    }

    if (levelNumber > progress.highestUnlockedLevel) {
      return {
        isEligible: false,
        reason: `Level ${levelNumber} is locked. Your highest unlocked level is ${progress.highestUnlockedLevel}.`
      };
    }

    return { isEligible: true };
  }

  /**
   * Returns complete language progression breakdown for a student.
   */
  public static async getStudentLanguagesProgress(
    studentId: string
  ): Promise<LanguageProgressionSummary[]> {
    const languages = await ProgrammingLanguage.find({ isEnabled: true }).sort({ name: 1 });
    const summaries: LanguageProgressionSummary[] = [];

    // Fetch student's current registrations and sessions
    const registrations = await ExaminationRegistration.find({
      studentId,
      status: { $in: ['registered', 'attended'] }
    }).populate('examinationId');

    const sessions = await ExaminationSession.find({
      studentId
    }).sort({ createdAt: -1 });

    for (const lang of languages) {
      const progress = await this.getOrCreateProgress(studentId, lang._id);
      const levels: LevelStatusInfo[] = [];

      for (let lvl = 1; lvl <= lang.totalLevels; lvl++) {
        const completedRecord = progress.completedLevels.find((c) => c.levelNumber === lvl);

        if (completedRecord) {
          levels.push({
            levelNumber: lvl,
            status: 'Passed',
            passedAt: completedRecord.passedAt,
            scorePercentage: completedRecord.percentage
          });
          continue;
        }

        // Check active session for this level and language
        const matchingReg = registrations.find((r: any) => {
          const exam = r.examinationId;
          return exam && exam.languageId?.toString() === lang._id.toString() && exam.levelNumber === lvl;
        });

        const matchingSession = matchingReg
          ? sessions.find((s) => s.examinationId.toString() === matchingReg.examinationId._id.toString())
          : null;

        if (matchingSession) {
          if (matchingSession.status === 'active') {
            levels.push({
              levelNumber: lvl,
              status: 'In progress',
              activeExamId: matchingSession.examinationId.toString()
            });
            continue;
          } else if (matchingSession.status === 'submitted') {
            // Check if result is failed
            const result = await ExaminationResult.findOne({ sessionId: matchingSession._id });
            if (result && !result.passed) {
              levels.push({
                levelNumber: lvl,
                status: 'Failed',
                scorePercentage: result.percentage
              });
              continue;
            }
          }
        }

        if (matchingReg && matchingReg.status === 'registered') {
          levels.push({
            levelNumber: lvl,
            status: 'Registered',
            activeExamId: (matchingReg.examinationId as any)?._id?.toString(),
            activeSlotId: matchingReg.slotId?.toString()
          });
          continue;
        }

        // Available or Locked
        if (lvl <= progress.highestUnlockedLevel) {
          levels.push({
            levelNumber: lvl,
            status: 'Available'
          });
        } else {
          levels.push({
            levelNumber: lvl,
            status: 'Locked',
            lockReason: `Requires passing Level ${lvl - 1} first.`
          });
        }
      }

      summaries.push({
        languageId: lang._id.toString(),
        languageName: lang.name,
        slug: lang.slug,
        totalLevels: lang.totalLevels,
        highestUnlockedLevel: progress.highestUnlockedLevel,
        levels
      });
    }

    return summaries;
  }

  /**
   * Finalizes an examination session, aggregates scores, evaluates pass criteria,
   * and conditionally unlocks the next level.
   * Fully idempotent: calling multiple times will not duplicate unlocked levels or awards.
   */
  public static async finalizeExamSession(
    sessionId: string,
    req?: any
  ): Promise<{ result: any; unlockedNextLevel: boolean; nextLevelNumber?: number }> {
    const session = await ExaminationSession.findById(sessionId);
    if (!session) {
      throw new Error('Examination session not found');
    }

    const exam = await Examination.findById(session.examinationId).populate('languageId');
    if (!exam) {
      throw new Error('Examination not found for this session');
    }

    // Mark session submitted if active
    if (session.status === 'active') {
      session.status = 'submitted';
      session.finishedAt = new Date();
      await session.save();
    }

    // Check if result already computed (idempotency check)
    let result = await ExaminationResult.findOne({ sessionId: session._id });
    if (!result) {
      // Calculate scores from all submissions under this session
      const { Submission } = await import('../models/Submission');
      const submissions = await Submission.find({ sessionId: session._id });

      let totalExamMarks = 0;
      let obtainedExamMarks = 0;

      // Group submissions by question and take highest or latest submission per question
      const questionMap = new Map<string, any>();
      for (const sub of submissions) {
        const qId = sub.questionId.toString();
        const existing = questionMap.get(qId);
        if (!existing || sub.score > existing.score) {
          questionMap.set(qId, sub);
        }
      }

      for (const qId of exam.questions) {
        const sub = questionMap.get(qId.toString());
        const maxQMarks = sub ? sub.maxScore : 100;
        totalExamMarks += maxQMarks;
        obtainedExamMarks += sub ? sub.score : 0;
      }

      // Default baseline if exam had no questions configured
      if (totalExamMarks === 0) totalExamMarks = 100;

      const percentage = Math.round((obtainedExamMarks / totalExamMarks) * 100);
      const passed = percentage >= exam.passingPercentage;

      result = await ExaminationResult.create({
        sessionId: session._id,
        examinationId: exam._id,
        studentId: session.studentId,
        languageId: exam.languageId._id,
        levelNumber: exam.levelNumber,
        totalMarks: totalExamMarks,
        obtainedMarks: obtainedExamMarks,
        percentage,
        passed,
        passingPercentageRequired: exam.passingPercentage,
        submissions: submissions.map((s) => s._id),
        verifiedAt: new Date()
      });

      await logAudit(
        'EXAM_RESULT_CALCULATED',
        {
          sessionId: session._id,
          studentId: session.studentId,
          examId: exam._id,
          levelNumber: exam.levelNumber,
          percentage,
          passed
        },
        req
      );
    }

    let unlockedNextLevel = false;
    let nextLevelNumber: number | undefined;

    // Progression Unlock Logic
    if (result.passed) {
      const progress = await this.getOrCreateProgress(session.studentId, exam.languageId._id);

      // Check if this level is already recorded in completedLevels
      const alreadyRecorded = progress.completedLevels.some(
        (c) => c.levelNumber === exam.levelNumber
      );

      if (!alreadyRecorded) {
        progress.completedLevels.push({
          levelNumber: exam.levelNumber,
          passedAt: new Date(),
          percentage: result.percentage,
          obtainedMarks: result.obtainedMarks,
          totalMarks: result.totalMarks,
          examinationId: exam._id as any,
          resultId: result._id as any
        });
      }

      const langDoc = await ProgrammingLanguage.findById(exam.languageId._id);
      const totalLevels = langDoc?.totalLevels || 6;

      // Unlock next level if current exam level equals highest unlocked
      if (exam.levelNumber >= progress.highestUnlockedLevel && exam.levelNumber < totalLevels) {
        progress.highestUnlockedLevel = exam.levelNumber + 1;
        unlockedNextLevel = true;
        nextLevelNumber = progress.highestUnlockedLevel;

        // In-app notification
        await Notification.create({
          userId: session.studentId,
          title: `Level ${nextLevelNumber} Unlocked!`,
          message: `Congratulations! You passed ${langDoc?.name || 'Programming'} Level ${exam.levelNumber} with ${result.percentage}%. Level ${nextLevelNumber} is now available.`,
          type: 'level_unlock',
          metadata: {
            languageId: exam.languageId._id,
            unlockedLevel: nextLevelNumber,
            examId: exam._id
          }
        });

        await logAudit(
          'LEVEL_UNLOCKED',
          {
            studentId: session.studentId,
            languageId: exam.languageId._id,
            unlockedLevel: nextLevelNumber
          },
          req
        );
      }

      await progress.save();

      await ExaminationRegistration.updateMany(
        { examinationId: exam._id, studentId: session.studentId },
        { status: 'attended' }
      );
    } else {
      // Failed exam logic:
      // If the student attended the exam but failed, automatically remove the course in My Courses
      const progress = await this.getOrCreateProgress(session.studentId, exam.languageId._id);
      if (progress.enrolledLevels && progress.enrolledLevels.length > 0) {
        progress.enrolledLevels = progress.enrolledLevels.filter((lvl) => lvl !== exam.levelNumber);
        if (progress.enrolledLevels.length === 0) {
          progress.isEnrolled = false;
        }
        await progress.save();
      }

      // Remove the registration record so it vanishes from My Courses and allows clean re-registration in Total Courses
      await ExaminationRegistration.deleteMany({
        examinationId: exam._id,
        studentId: session.studentId
      });

      await Notification.create({
        userId: session.studentId,
        title: `Exam Result: Level ${exam.levelNumber} - Failed (${result.percentage}%)`,
        message: `You scored ${result.percentage}%, which did not meet the required ${exam.passingPercentage}%. The level has been removed from My Courses. You can register again in Total Courses to retake the exam.`,
        type: 'exam_failed',
        metadata: {
          languageId: exam.languageId._id,
          levelNumber: exam.levelNumber,
          percentage: result.percentage
        }
      });

      await logAudit(
        'EXAM_FAILED_AUTO_REMOVED_FROM_MY_COURSES',
        {
          studentId: session.studentId,
          languageId: exam.languageId._id,
          levelNumber: exam.levelNumber,
          percentage: result.percentage
        },
        req
      );
    }

    return { result, unlockedNextLevel, nextLevelNumber };
  }
}

