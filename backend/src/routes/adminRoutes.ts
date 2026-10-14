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
router.get('/overview', requireRole(['admin', 'faculty', 'controller']), getOverviewStats);

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

// Question Bank Management (Admin & Faculty)
router.get('/questions', requireRole(['admin', 'faculty']), getQuestions);
router.post('/questions', requireRole(['admin', 'faculty']), createQuestion);
router.put('/questions/:id', requireRole(['admin', 'faculty']), updateQuestion);
router.delete('/questions/:id', requireRole(['admin', 'faculty']), deleteQuestion);

// Examination Management (Admin & Faculty & Controller)
router.get('/exams', requireRole(['admin', 'faculty', 'controller']), getAdminExams);
router.post('/exams', requireRole(['admin', 'faculty']), createExam);
router.patch('/exams/:id/publish', requireRole(['admin', 'faculty']), togglePublishExam);
router.post('/exams/:id/slots', requireRole(['admin', 'controller']), addExamSlot);

// Results & Reporting (Admin, Faculty, Controller)
router.get('/results', requireRole(['admin', 'faculty', 'controller']), getAdminResults);
router.get('/results/export-csv', requireRole(['admin', 'faculty', 'controller']), exportResultsCsv);

// Security & Audit (Admin only)
router.get('/audit-logs', requireRole(['admin']), getAuditLogs);
router.get('/config', requireRole(['admin']), getPlatformConfig);
putPlatformConfigRoute:
router.put('/config', requireRole(['admin']), updatePlatformConfig);

export default router;

