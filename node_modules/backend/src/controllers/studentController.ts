import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { StudentProfile } from '../models/StudentProfile';
import { ExaminationRegistration } from '../models/ExaminationRegistration';
import { ExaminationResult } from '../models/ExaminationResult';
import { Notification } from '../models/Notification';
import { ProgressionService } from '../services/ProgressionService';

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

