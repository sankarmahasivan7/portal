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

// Examination schedules & registration (accessible from anywhere)
router.get('/available', getAvailableExams);
router.get('/:id', getExamById);
router.get('/:id/attendance-status', getExamAttendanceStatus);
router.post('/:id/register', registerForExamSlot);
router.post('/:id/cancel-registration', cancelRegistration);

// Examination execution arena (taking the test strictly requires College Campus Lab Network & SEB)
router.post('/:id/start-session', checkCollegeNetwork, verifySafeExamBrowser, startExaminationSession);
router.get('/session/:sessionId', checkCollegeNetwork, verifySafeExamBrowser, getSessionData);
router.post('/session/:sessionId/draft', checkCollegeNetwork, verifySafeExamBrowser, saveDraft);
router.post('/session/:sessionId/run', checkCollegeNetwork, verifySafeExamBrowser, runPublicCode);
router.post('/session/:sessionId/submit', checkCollegeNetwork, verifySafeExamBrowser, submitQuestionAnswer);
router.post('/session/:sessionId/finalize', checkCollegeNetwork, finalizeSession);
router.get('/session/:sessionId/result', getSessionResult);

export default router;

