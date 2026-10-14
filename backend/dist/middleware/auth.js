"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication required. Missing Bearer token.' });
    }
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'college_ps_portal_super_secure_jwt_secret_change_in_prod';
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        User_1.User.findById(decoded.id)
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
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
    }
}
function requireRole(allowedRoles) {
    return (req, res, next) => {
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
