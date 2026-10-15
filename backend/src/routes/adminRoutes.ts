import { Router } from 'express';
import {
  getOverviewStats,
  getStudents,
  createStudent,
  toggleStudentStatus,
  resetStudentPassword,
  importStudentsCsv,
  exportStudentsCsv,
  getLanguages,
  createLanguage,
  updateLanguage,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAdminExams,
  createExam,
  togglePublishExam,
  addExamSlot,
  getSlotAttendance,
  markStudentAttendance,
  markBulkAttendance,
  getAttendanceByTiming,
  markAttendanceDirect,
  markBulkAttendanceDirect,
  removeAbsentCourseFromStudent,
  searchStudentsForAssignment,
  assignStudentToCourseExam,
  generateSubmissionOtp,
  getAdminResults,
  exportResultsCsv,
  getAuditLogs,
  getPlatformConfig,
  updatePlatformConfig,
  downloadSebConfig
} from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Public download of SEB profile for students/admins
router.get('/seb/download-config', downloadSebConfig);

router.use(authenticate);

// Overview
router.get('/overview', requireRole(['admin', 'controller']), getOverviewStats);

// Student Management (Admin & Controller)
router.get('/students', requireRole(['admin', 'controller']), getStudents);
router.post('/students', requireRole(['admin']), createStudent);
router.patch('/students/:id/status', requireRole(['admin']), toggleStudentStatus);
router.post('/students/:id/reset-password', requireRole(['admin']), resetStudentPassword);
router.post('/students/import-csv', requireRole(['admin']), importStudentsCsv);
router.get('/students/export-csv', requireRole(['admin']), exportStudentsCsv);

// Programming Language Management
router.get('/languages', requireRole(['admin', 'faculty']), getLanguages);
router.post('/languages', requireRole(['admin']), createLanguage);
router.patch('/languages/:id', requireRole(['admin']), updateLanguage);

// Question Bank Management (Admin)
router.get('/questions', requireRole(['admin', 'faculty']), getQuestions);
router.post('/questions', requireRole(['admin']), createQuestion);
router.put('/questions/:id', requireRole(['admin']), updateQuestion);
router.delete('/questions/:id', requireRole(['admin']), deleteQuestion);

// Examination Management (Admin & Faculty & Controller)
router.get('/exams', requireRole(['admin', 'faculty', 'controller']), getAdminExams);
router.post('/exams', requireRole(['admin', 'faculty']), createExam);
router.patch('/exams/:id/publish', requireRole(['admin', 'faculty']), togglePublishExam);
router.post('/exams/:id/slots', requireRole(['admin', 'faculty', 'controller']), addExamSlot);

// Attendance & Hall Invigilation (Admin, Faculty, Controller)
router.get('/attendance', requireRole(['admin', 'faculty', 'controller']), getAttendanceByTiming);
router.post('/attendance/mark', requireRole(['admin', 'faculty', 'controller']), markAttendanceDirect);
router.post('/attendance/bulk-mark', requireRole(['admin', 'faculty', 'controller']), markBulkAttendanceDirect);
router.post('/attendance/remove-absent-course', requireRole(['admin', 'faculty', 'controller']), removeAbsentCourseFromStudent);
router.get('/attendance/search-students', requireRole(['admin', 'faculty', 'controller']), searchStudentsForAssignment);
router.post('/attendance/assign-course-exam', requireRole(['admin', 'faculty', 'controller']), assignStudentToCourseExam);
router.post('/attendance/generate-submission-otp', requireRole(['admin', 'faculty', 'controller']), generateSubmissionOtp);
router.get('/exams/:id/slots/:slotId/attendance', requireRole(['admin', 'faculty', 'controller']), getSlotAttendance);
router.post('/exams/:id/slots/:slotId/attendance', requireRole(['admin', 'faculty', 'controller']), markStudentAttendance);
router.post('/exams/:id/slots/:slotId/attendance/bulk', requireRole(['admin', 'faculty', 'controller']), markBulkAttendance);

// Results & Reporting (Admin, Controller)
router.get('/results', requireRole(['admin', 'controller']), getAdminResults);
router.get('/results/export-csv', requireRole(['admin', 'controller']), exportResultsCsv);

// Security & Audit (Admin only)
router.get('/audit-logs', requireRole(['admin']), getAuditLogs);
router.get('/config', requireRole(['admin']), getPlatformConfig);
putPlatformConfigRoute:
router.put('/config', requireRole(['admin']), updatePlatformConfig);

export default router;

