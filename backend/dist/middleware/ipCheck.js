"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientIp = getClientIp;
exports.checkCollegeNetwork = checkCollegeNetwork;
const PlatformConfiguration_1 = require("../models/PlatformConfiguration");
function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}
function isIpInCidr(ip, cidr) {
    if (cidr === ip)
        return true;
    if (!cidr.includes('/'))
        return cidr === ip;
    const [range, bitsStr] = cidr.split('/');
    const bits = parseInt(bitsStr, 10);
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    try {
        const ipInt = ipToInt(ip);
        const rangeInt = ipToInt(range);
        return (ipInt & mask) === (rangeInt & mask);
    }
    catch {
        return false;
    }
}
function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        const ips = (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(',');
        return ips[0].trim();
    }
    return req.socket.remoteAddress || req.ip || '127.0.0.1';
}
async function checkCollegeNetwork(req, res, next) {
    // Admins are exempt from IP lockouts for emergency recovery
    if (req.user && (req.user.role === 'admin' || req.user.collegeIpExempt)) {
        return next();
    }
    const rawIp = getClientIp(req);
    // Normalize IPv6 mapped IPv4 e.g. ::ffff:127.0.0.1
    const clientIp = rawIp.replace(/^::ffff:/, '');
    try {
        const config = await PlatformConfiguration_1.PlatformConfiguration.findOne({ key: 'global_config' });
        const allowedRanges = config?.collegeNetworkRanges || ['127.0.0.1', '::1', '10.0.0.0/8', '192.168.0.0/16'];
        const isAllowed = allowedRanges.some((range) => {
            if (range === '127.0.0.1' && (clientIp === '127.0.0.1' || clientIp === '::1'))
                return true;
            if (range === '::1' && clientIp === '::1')
                return true;
            return isIpInCidr(clientIp, range);
        });
        if (!isAllowed) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Examinations and student services are restricted to college campus networks. Your IP (${clientIp}) is not within the authorized campus IP ranges.`
            });
        }
        next();
    }
    catch (error) {
        // If config fetch fails, don't crash, proceed with safe logging
        next();
    }
}
