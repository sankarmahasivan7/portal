import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { PlatformConfiguration } from '../models/PlatformConfiguration';
import { logAudit } from '../services/AuditService';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'college_ps_portal_super_secure_jwt_secret_change_in_prod';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact an administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await logAudit('LOGIN_FAILED', { email }, req);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any
    });

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id });
    }

    await logAudit('LOGIN_SUCCESS', { email: user.email, role: user.role }, req, user);

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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName, studentId, department, batch, enrollmentNumber } = req.body;

    const config = await PlatformConfiguration.findOne({ key: 'global_config' });
    if (config && !config.allowStudentSelfRegistration) {
      return res.status(403).json({
        success: false,
        message: 'Self-registration is currently disabled. Please contact your examination department.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'student',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      studentId: studentId?.trim(),
      isActive: true
    });

    const profile = await StudentProfile.create({
      userId: user._id,
      studentId: studentId?.trim() || `STU-${Date.now().toString().slice(-4)}`,
      department: department || 'Computer Science and Engineering',
      batch: batch || '2022-2026',
      enrollmentNumber: enrollmentNumber || `ENR${Date.now().toString().slice(-6)}`
    });

    await logAudit('STUDENT_SELF_REGISTERED', { email: user.email, studentId: user.studentId }, req, user);

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id });
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error retrieving profile', error: error.message });
  }
}

