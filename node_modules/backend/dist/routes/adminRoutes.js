"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public download of SEB profile for students/admins
router.get('/seb/download-config', adminController_1.downloadSebConfig);
router.use(auth_1.authenticate);
// Overview
router.get('/overview', (0, auth_1.requireRole)(['admin', 'faculty', 'controller']), adminController_1.getOverviewStats);
// Student Management (Admin & Controller)
router.get('/students', (0, auth_1.requireRole)(['admin', 'controller']), adminController_1.getStudents);
router.post('/students', (0, auth_1.requireRole)(['admin']), adminController_1.createStudent);
router.patch('/students/:id/status', (0, auth_1.requireRole)(['admin']), adminController_1.toggleStudentStatus);
router.post('/students/:id/reset-password', (0, auth_1.requireRole)(['admin']), adminController_1.resetStudentPassword);
router.post('/students/import-csv', (0, auth_1.requireRole)(['admin']), adminController_1.importStudentsCsv);
router.get('/students/export-csv', (0, auth_1.requireRole)(['admin']), adminController_1.exportStudentsCsv);
// Programming Language Management
router.get('/languages', (0, auth_1.requireRole)(['admin', 'faculty']), adminController_1.getLanguages);
router.post('/languages', (0, auth_1.requireRole)(['admin']), adminController_1.createLanguage);
router.patch('/languages/:id', (0, auth_1.requireRole)(['admin']), adminController_1.updateLanguage);
// Question Bank Management (Admin & Faculty)
router.get('/questions', (0, auth_1.requireRole)(['admin', 'faculty']), adminController_1.getQuestions);
router.post('/questions', (0, auth_1.requireRole)(['admin', 'faculty']), adminController_1.createQuestion);
router.put('/questions/:id', (0, auth_1.requireRole)(['admin', 'faculty']), adminController_1.updateQuestion);
router.delete('/questions/:id', (0, auth_1.requireRole)(['admin', 'faculty']), adminController_1.deleteQuestion);
// Examination Management (Admin & Faculty & Controller)
router.get('/exams', (0, auth_1.requireRole)(['admin', 'faculty', 'controller']), adminController_1.getAdminExams);
router.post('/exams', (0, auth_1.requireRole)(['admin', 'faculty']), adminController_1.createExam);
router.patch('/exams/:id/publish', (0, auth_1.requireRole)(['admin', 'faculty']), adminController_1.togglePublishExam);
router.post('/exams/:id/slots', (0, auth_1.requireRole)(['admin', 'controller']), adminController_1.addExamSlot);
// Results & Reporting (Admin, Faculty, Controller)
router.get('/results', (0, auth_1.requireRole)(['admin', 'faculty', 'controller']), adminController_1.getAdminResults);
router.get('/results/export-csv', (0, auth_1.requireRole)(['admin', 'faculty', 'controller']), adminController_1.exportResultsCsv);
// Security & Audit (Admin only)
router.get('/audit-logs', (0, auth_1.requireRole)(['admin']), adminController_1.getAuditLogs);
router.get('/config', (0, auth_1.requireRole)(['admin']), adminController_1.getPlatformConfig);
putPlatformConfigRoute: router.put('/config', (0, auth_1.requireRole)(['admin']), adminController_1.updatePlatformConfig);
exports.default = router;
