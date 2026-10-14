import { Request } from 'express';
import { AuditLog } from '../models/AuditLog';
import { IUser } from '../models/User';
import { getClientIp } from '../middleware/ipCheck';

export async function logAudit(
  action: string,
  details: Record<string, any>,
  req?: Request,
  user?: IUser
): Promise<void> {
  try {
    const ipAddress = req ? getClientIp(req as any) : undefined;
    const userAgent = req?.headers['user-agent'];

    await AuditLog.create({
      userId: user?._id || (req as any)?.user?._id,
      userEmail: user?.email || (req as any)?.user?.email,
      role: user?.role || (req as any)?.user?.role,
      action,
      details,
      ipAddress,
      userAgent,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('[AuditService] Failed to record audit log:', error);
  }
}

