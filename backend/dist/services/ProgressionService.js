"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressionService = void 0;
const StudentProgress_1 = require("../models/StudentProgress");
const ProgrammingLanguage_1 = require("../models/ProgrammingLanguage");
const Examination_1 = require("../models/Examination");
const ExaminationResult_1 = require("../models/ExaminationResult");
const ExaminationSession_1 = require("../models/ExaminationSession");
const ExaminationRegistration_1 = require("../models/ExaminationRegistration");
const Notification_1 = require("../models/Notification");
const AuditService_1 = require("./AuditService");
class ProgressionService {
    /**
     * Retrieves or initializes student progress for a language.
     * If not found, initializes Level 1 as unlocked (Level 1 has no prerequisite).
     */
    static async getOrCreateProgress(studentId, languageId) {
        let progress = await StudentProgress_1.StudentProgress.findOne({ studentId, languageId });
        if (!progress) {
            progress = await StudentProgress_1.StudentProgress.create({
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
    static async verifyEligibility(studentId, languageId, levelNumber) {
        if (levelNumber === 1) {
            return { isEligible: true };
        }
        const progress = await this.getOrCreateProgress(studentId, languageId);
        // Rule: Level N requires Level N - 1 to be passed
        const prerequisiteLevel = levelNumber - 1;
        const hasPassedPrereq = progress.completedLevels.some((c) => c.levelNumber === prerequisiteLevel);
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
    static async getStudentLanguagesProgress(studentId) {
        const languages = await ProgrammingLanguage_1.ProgrammingLanguage.find({ isEnabled: true }).sort({ name: 1 });
        const summaries = [];
        // Fetch student's current registrations and sessions
        const registrations = await ExaminationRegistration_1.ExaminationRegistration.find({
            studentId,
            status: { $in: ['registered', 'attended'] }
        }).populate('examinationId');
        const sessions = await ExaminationSession_1.ExaminationSession.find({
            studentId
        }).sort({ createdAt: -1 });
        for (const lang of languages) {
            const progress = await this.getOrCreateProgress(studentId, lang._id);
            const levels = [];
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
                const matchingReg = registrations.find((r) => {
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
                    }
                    else if (matchingSession.status === 'submitted') {
                        // Check if result is failed
                        const result = await ExaminationResult_1.ExaminationResult.findOne({ sessionId: matchingSession._id });
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
                        activeExamId: matchingReg.examinationId?._id?.toString(),
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
                }
                else {
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
    static async finalizeExamSession(sessionId, req) {
        const session = await ExaminationSession_1.ExaminationSession.findById(sessionId);
        if (!session) {
            throw new Error('Examination session not found');
        }
        const exam = await Examination_1.Examination.findById(session.examinationId).populate('languageId');
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
        let result = await ExaminationResult_1.ExaminationResult.findOne({ sessionId: session._id });
        if (!result) {
            // Calculate scores from all submissions under this session
            const { Submission } = await Promise.resolve().then(() => __importStar(require('../models/Submission')));
            const submissions = await Submission.find({ sessionId: session._id });
            let totalExamMarks = 0;
            let obtainedExamMarks = 0;
            // Group submissions by question and take highest or latest submission per question
            const questionMap = new Map();
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
            if (totalExamMarks === 0)
                totalExamMarks = 100;
            const percentage = Math.round((obtainedExamMarks / totalExamMarks) * 100);
            const passed = percentage >= exam.passingPercentage;
            result = await ExaminationResult_1.ExaminationResult.create({
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
            await (0, AuditService_1.logAudit)('EXAM_RESULT_CALCULATED', {
                sessionId: session._id,
                studentId: session.studentId,
                examId: exam._id,
                levelNumber: exam.levelNumber,
                percentage,
                passed
            }, req);
        }
        let unlockedNextLevel = false;
        let nextLevelNumber;
        // Progression Unlock Logic
        if (result.passed) {
            const progress = await this.getOrCreateProgress(session.studentId, exam.languageId._id);
            // Check if this level is already recorded in completedLevels
            const alreadyRecorded = progress.completedLevels.some((c) => c.levelNumber === exam.levelNumber);
            if (!alreadyRecorded) {
                progress.completedLevels.push({
                    levelNumber: exam.levelNumber,
                    passedAt: new Date(),
                    percentage: result.percentage,
                    obtainedMarks: result.obtainedMarks,
                    totalMarks: result.totalMarks,
                    examinationId: exam._id,
                    resultId: result._id
                });
            }
            const langDoc = await ProgrammingLanguage_1.ProgrammingLanguage.findById(exam.languageId._id);
            const totalLevels = langDoc?.totalLevels || 6;
            // Unlock next level if current exam level equals highest unlocked
            if (exam.levelNumber >= progress.highestUnlockedLevel && exam.levelNumber < totalLevels) {
                progress.highestUnlockedLevel = exam.levelNumber + 1;
                unlockedNextLevel = true;
                nextLevelNumber = progress.highestUnlockedLevel;
                // In-app notification
                await Notification_1.Notification.create({
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
                await (0, AuditService_1.logAudit)('LEVEL_UNLOCKED', {
                    studentId: session.studentId,
                    languageId: exam.languageId._id,
                    unlockedLevel: nextLevelNumber
                }, req);
            }
            await progress.save();
        }
        return { result, unlockedNextLevel, nextLevelNumber };
    }
}
exports.ProgressionService = ProgressionService;
