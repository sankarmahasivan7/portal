import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { PlatformConfiguration } from '../models/PlatformConfiguration';
import { logAudit } from '../services/AuditService';
import { AuthRequest } from '../middleware/auth';
import { parseCollegeEmail } from '../utils/collegeEmail';

const JWT_SECRET = process.env.JWT_SECRET || 'college_ps_portal_super_secure_jwt_secret_change_in_prod';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact an administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await logAudit('LOGIN_FAILED', { email: cleanEmail }, req);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // If college email pattern, ensure student department and year categorization is kept in sync
    const emailInfo = parseCollegeEmail(user.email);
    if (emailInfo.isValid && user.role === 'student') {
      let needsSave = false;
      if (user.department !== emailInfo.departmentName) {
        user.department = emailInfo.departmentName;
        needsSave = true;
      }
      if (user.year !== emailInfo.year) {
        user.year = emailInfo.year;
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any
    });

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id });
      if (profile && emailInfo.isValid) {
        if (profile.department !== emailInfo.departmentName || profile.year !== emailInfo.year) {
          profile.department = emailInfo.departmentName!;
          profile.year = emailInfo.year!;
          profile.batch = emailInfo.batch!;
          await profile.save();
        }
      }
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
        department: user.department,
        year: user.year,
        profile
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName, studentId, enrollmentNumber } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Institutional College Email Verification & Categorization
    // Pattern: <name>.ug.<year>.<dept>@francisxavier.ac.in
    const emailInfo = parseCollegeEmail(email);
    if (!emailInfo.isValid) {
      return res.status(400).json({
        success: false,
        message: emailInfo.error
      });
    }

    const config = await PlatformConfiguration.findOne({ key: 'global_config' });
    if (config && !config.allowStudentSelfRegistration) {
      return res.status(403).json({
        success: false,
        message: 'Self-registration is currently disabled. Please contact your examination department.'
      });
    }

    const cleanEmail = emailInfo.rawEmail;
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this institutional email already exists.' });
    }

    const resolvedDept = emailInfo.departmentName!;
    const resolvedYear = emailInfo.year!;
    const resolvedBatch = emailInfo.batch!;

    // Derive names if not entered
    const defaultName = emailInfo.name || 'Student';
    const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
    const cleanFirst = firstName?.trim() || formattedName;
    const cleanLast = lastName?.trim() || 'FX';
    const cleanStudentId = studentId?.trim() || `FX${emailInfo.batchCode}${emailInfo.departmentCode?.toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: cleanEmail,
      passwordHash,
      role: 'student',
      firstName: cleanFirst,
      lastName: cleanLast,
      studentId: cleanStudentId,
      department: resolvedDept,
      year: resolvedYear,
      isActive: true
    });

    const profile = await StudentProfile.create({
      userId: user._id,
      studentId: cleanStudentId,
      department: resolvedDept,
      batch: resolvedBatch,
      year: resolvedYear,
      semester: (resolvedYear * 2) - 1, // Year 1 -> Sem 1, Year 2 -> Sem 3, Year 3 -> Sem 5, Year 4 -> Sem 7
      enrollmentNumber: enrollmentNumber?.trim() || `ENR${emailInfo.batchCode}${emailInfo.departmentCode?.toUpperCase()}${Date.now().toString().slice(-4)}`
    });

    await logAudit('STUDENT_SELF_REGISTERED', { email: user.email, studentId: user.studentId, department: resolvedDept, year: resolvedYear }, req, user);

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
        department: user.department,
        year: user.year,
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

