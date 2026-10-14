import { Router } from 'express';
import { getStudentDashboard, getNotifications, markNotificationRead } from '../controllers/studentController';
import { authenticate, requireRole } from '../middleware/auth';
import { checkCollegeNetwork } from '../middleware/ipCheck';

const router = Router();

router.use(authenticate);
router.use(checkCollegeNetwork);

router.get('/dashboard', requireRole(['student']), getStudentDashboard);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;

