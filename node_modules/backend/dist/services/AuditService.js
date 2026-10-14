"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = logAudit;
const AuditLog_1 = require("../models/AuditLog");
const ipCheck_1 = require("../middleware/ipCheck");
async function logAudit(action, details, req, user) {
    try {
        const ipAddress = req ? (0, ipCheck_1.getClientIp)(req) : undefined;
        const userAgent = req?.headers['user-agent'];
        await AuditLog_1.AuditLog.create({
            userId: user?._id || req?.user?._id,
            userEmail: user?.email || req?.user?.email,
            role: user?.role || req?.user?.role,
            action,
            details,
            ipAddress,
            userAgent,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('[AuditService] Failed to record audit log:', error);
    }
}
