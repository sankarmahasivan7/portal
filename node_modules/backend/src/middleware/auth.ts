import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Missing Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'college_ps_portal_super_secure_jwt_secret_change_in_prod';

  try {
    const decoded = jwt.verify(token, secret) as { id: string; role: UserRole };
    User.findById(decoded.id)
      .then((user) => {
        if (!user) {
          return res.status(401).json({ success: false, message: 'User not found or deactivated.' });
        }
        if (!user.isActive) {
          return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact an administrator.' });
        }
        req.user = user;
        req.userId = user._id.toString();
        next();
      })
      .catch((err) => {
        return res.status(500).json({ success: false, message: 'Authentication error', error: err.message });
      });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted. Required role(s): [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
      });
    }
    next();
  };
}

