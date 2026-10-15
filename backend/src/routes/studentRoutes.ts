import { Router } from 'express';
import {
  getStudentDashboard,
  getTotalCourses,
  getMyCourses,
  getLevelDetail,
  getCourseOverview,
  registerCourseLevel,
  getNotifications,
  markNotificationRead
} from '../controllers/studentController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Student core pages
router.get('/dashboard', requireRole(['student']), getStudentDashboard);
router.get('/total-courses', requireRole(['student']), getTotalCourses);
router.get('/my-courses', requireRole(['student']), getMyCourses);
router.get('/course-overview/:languageSlug', requireRole(['student']), getCourseOverview);
router.post('/course/:languageSlug/register', requireRole(['student']), registerCourseLevel);
router.get('/course/:languageId/level/:levelNumber', requireRole(['student']), getLevelDetail);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;
