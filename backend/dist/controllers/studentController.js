"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentDashboard = getStudentDashboard;
exports.getNotifications = getNotifications;
exports.markNotificationRead = markNotificationRead;
const StudentProfile_1 = require("../models/StudentProfile");
const ExaminationRegistration_1 = require("../models/ExaminationRegistration");
const ExaminationResult_1 = require("../models/ExaminationResult");
const Notification_1 = require("../models/Notification");
const ProgressionService_1 = require("../services/ProgressionService");
async function getStudentDashboard(req, res) {
    try {
        const studentId = req.userId;
        const user = req.user;
        const [profile, progressByLanguage, registrations, recentResults, notifications] = await Promise.all([
            StudentProfile_1.StudentProfile.findOne({ userId: studentId }),
            ProgressionService_1.ProgressionService.getStudentLanguagesProgress(studentId),
            ExaminationRegistration_1.ExaminationRegistration.find({ studentId, status: { $in: ['registered', 'attended'] } })
                .populate({
                path: 'examinationId',
                populate: { path: 'languageId' }
            })
                .populate('slotId')
                .sort({ createdAt: -1 }),
            ExaminationResult_1.ExaminationResult.find({ studentId })
                .populate({
                path: 'examinationId',
                populate: { path: 'languageId' }
            })
                .sort({ verifiedAt: -1 })
                .limit(10),
            Notification_1.Notification.find({ userId: studentId }).sort({ createdAt: -1 }).limit(15)
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
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to load dashboard data', error: error.message });
    }
}
async function getNotifications(req, res) {
    try {
        const notifications = await Notification_1.Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
        return res.json({ success: true, notifications });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
    }
}
async function markNotificationRead(req, res) {
    try {
        const { id } = req.params;
        await Notification_1.Notification.findOneAndUpdate({ _id: id, userId: req.userId }, { isRead: true });
        return res.json({ success: true });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error marking notification read', error: error.message });
    }
}
