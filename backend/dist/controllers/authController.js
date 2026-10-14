"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
exports.getMe = getMe;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const StudentProfile_1 = require("../models/StudentProfile");
const PlatformConfiguration_1 = require("../models/PlatformConfiguration");
const AuditService_1 = require("../services/AuditService");
const JWT_SECRET = process.env.JWT_SECRET || 'college_ps_portal_super_secure_jwt_secret_change_in_prod';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }
        const user = await User_1.User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is deactivated. Contact an administrator.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            await (0, AuditService_1.logAudit)('LOGIN_FAILED', { email }, req);
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });
        let profile = null;
        if (user.role === 'student') {
            profile = await StudentProfile_1.StudentProfile.findOne({ userId: user._id });
        }
        await (0, AuditService_1.logAudit)('LOGIN_SUCCESS', { email: user.email, role: user.role }, req, user);
        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                studentId: user.studentId,
                profile
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
}
async function register(req, res) {
    try {
        const { email, password, firstName, lastName, studentId, department, batch, enrollmentNumber } = req.body;
        const config = await PlatformConfiguration_1.PlatformConfiguration.findOne({ key: 'global_config' });
        if (config && !config.allowStudentSelfRegistration) {
            return res.status(403).json({
                success: false,
                message: 'Self-registration is currently disabled. Please contact your examination department.'
            });
        }
        const existingUser = await User_1.User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.User.create({
            email: email.toLowerCase().trim(),
            passwordHash,
            role: 'student',
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            studentId: studentId?.trim(),
            isActive: true
        });
        const profile = await StudentProfile_1.StudentProfile.create({
            userId: user._id,
            studentId: studentId?.trim() || `STU-${Date.now().toString().slice(-4)}`,
            department: department || 'Computer Science and Engineering',
            batch: batch || '2022-2026',
            enrollmentNumber: enrollmentNumber || `ENR${Date.now().toString().slice(-6)}`
        });
        await (0, AuditService_1.logAudit)('STUDENT_SELF_REGISTERED', { email: user.email, studentId: user.studentId }, req, user);
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });
        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                studentId: user.studentId,
                profile
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
}
async function getMe(req, res) {
    try {
        const user = req.user;
        let profile = null;
        if (user.role === 'student') {
            profile = await StudentProfile_1.StudentProfile.findOne({ userId: user._id });
        }
        return res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                studentId: user.studentId,
                isActive: user.isActive,
                profile
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error retrieving profile', error: error.message });
    }
}
