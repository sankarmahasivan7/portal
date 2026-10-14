"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const examController_1 = require("../controllers/examController");
const auth_1 = require("../middleware/auth");
const ipCheck_1 = require("../middleware/ipCheck");
const sebCheck_1 = require("../middleware/sebCheck");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.use(ipCheck_1.checkCollegeNetwork);
// Examination schedules & registration
router.get('/available', examController_1.getAvailableExams);
router.get('/:id', examController_1.getExamById);
router.post('/:id/register', examController_1.registerForExamSlot);
router.post('/:id/cancel-registration', examController_1.cancelRegistration);
// Examination execution arena (enforces Safe Exam Browser if mandated)
router.post('/:id/start-session', sebCheck_1.verifySafeExamBrowser, examController_1.startExaminationSession);
router.get('/session/:sessionId', sebCheck_1.verifySafeExamBrowser, examController_1.getSessionData);
router.post('/session/:sessionId/draft', sebCheck_1.verifySafeExamBrowser, examController_1.saveDraft);
router.post('/session/:sessionId/run', sebCheck_1.verifySafeExamBrowser, examController_1.runPublicCode);
router.post('/session/:sessionId/submit', sebCheck_1.verifySafeExamBrowser, examController_1.submitQuestionAnswer);
router.post('/session/:sessionId/finalize', examController_1.finalizeSession);
router.get('/session/:sessionId/result', examController_1.getSessionResult);
exports.default = router;
