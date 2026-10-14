"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const studentRoutes_1 = __importDefault(require("./studentRoutes"));
const examRoutes_1 = __importDefault(require("./examRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/student', studentRoutes_1.default);
router.use('/exams', examRoutes_1.default);
router.use('/admin', adminRoutes_1.default);
exports.default = router;
