"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySafeExamBrowser = verifySafeExamBrowser;
const PlatformConfiguration_1 = require("../models/PlatformConfiguration");
/**
 * Checks Safe Exam Browser headers if examination or global policy mandates SEB.
 * SEB sends HTTP headers:
 * - 'x-safeexambrowser-confighash' or 'x-safeexambrowser-configkeyhash'
 * - 'x-safeexambrowser-requesthash'
 * In development mode, requests are allowed with an informative header.
 */
async function verifySafeExamBrowser(req, res, next) {
    // If exam or platform does not mandate SEB, allow
    const config = await PlatformConfiguration_1.PlatformConfiguration.findOne({ key: 'global_config' });
    const isEnforced = config?.sebEnforced ?? false;
    if (!isEnforced || process.env.NODE_ENV === 'development') {
        // Development mode bypass enabled
        res.setHeader('X-SEB-Mode', isEnforced ? 'Enforced-DevBypass' : 'Optional');
        return next();
    }
    const sebConfigKeyHeader = req.headers['x-safeexambrowser-configkeyhash'];
    const sebRequestHashHeader = req.headers['x-safeexambrowser-requesthash'];
    if (!sebConfigKeyHeader && !sebRequestHashHeader) {
        return res.status(403).json({
            success: false,
            message: 'Safe Exam Browser Required: This examination session must be opened using the configured Safe Exam Browser client. Download the college .seb profile from your dashboard.',
            sebRequired: true
        });
    }
    // If a specific config key is configured, verify match
    if (config?.sebConfigKey && config.sebConfigKey.trim().length > 0) {
        if (sebConfigKeyHeader !== config.sebConfigKey) {
            return res.status(403).json({
                success: false,
                message: 'Untrusted Safe Exam Browser configuration key detected. Please re-download the official examination configuration.',
                sebRequired: true
            });
        }
    }
    next();
}
