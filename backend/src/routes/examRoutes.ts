import { Router } from 'express';
import {
  getAvailableExams,
  getExamById,
  registerForExamSlot,
  cancelRegistration,
  startExaminationSession,
  getExamAttendanceStatus,
  getSessionData,
  saveDraft,
  runPublicCode,
  submitQuestionAnswer,
  finalizeSession,
  getSessionResult
} from '../controllers/examController';
import { authenticate } from '../middleware/auth';
import { checkCollegeNetwork } from '../middleware/ipCheck';
import { verifySafeExamBrowser } from '../middleware/sebCheck';

const router = Router();

router.use(authenticate);
router.use(checkCollegeNetwork);

// Examination schedules & registration
router.get('/available', getAvailableExams);
router.get('/:id', getExamById);
router.get('/:id/attendance-status', getExamAttendanceStatus);
router.post('/:id/register', registerForExamSlot);
router.post('/:id/cancel-registration', cancelRegistration);

// Examination execution arena (enforces Safe Exam Browser if mandated)
router.post('/:id/start-session', verifySafeExamBrowser, startExaminationSession);
router.get('/session/:sessionId', verifySafeExamBrowser, getSessionData);
router.post('/session/:sessionId/draft', verifySafeExamBrowser, saveDraft);
router.post('/session/:sessionId/run', verifySafeExamBrowser, runPublicCode);
router.post('/session/:sessionId/submit', verifySafeExamBrowser, submitQuestionAnswer);
router.post('/session/:sessionId/finalize', finalizeSession);
router.get('/session/:sessionId/result', getSessionResult);

export default router;

