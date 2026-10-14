import { Router } from 'express';
import {
  getStudentDashboard,
  getTotalCourses,
  getMyCourses,
  getLevelDetail,
  getNotifications,
  markNotificationRead
} from '../controllers/studentController';
import { authenticate, requireRole } from '../middleware/auth';
import { checkCollegeNetwork } from '../middleware/ipCheck';

const router = Router();

router.use(authenticate);
router.use(checkCollegeNetwork);

// Student core pages
router.get('/dashboard', requireRole(['student']), getStudentDashboard);
router.get('/total-courses', requireRole(['student']), getTotalCourses);
router.get('/my-courses', requireRole(['student']), getMyCourses);
router.get('/course/:languageId/level/:levelNumber', requireRole(['student']), getLevelDetail);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;
