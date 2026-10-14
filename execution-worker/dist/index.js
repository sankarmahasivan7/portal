"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const sandbox_1 = require("./runner/sandbox");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5050;
const WORKER_SECRET = process.env.WORKER_SECRET || 'isolated_worker_internal_secret_998877';
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '5mb' }));
// Healthcheck and compiler detection endpoint
app.get('/health', async (_req, res) => {
    const compilers = await (0, sandbox_1.checkCompilerAvailability)();
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'college-ps-execution-worker',
        compilers
    });
});
// Authentication middleware for worker
function authWorker(req, res, next) {
    const secretHeader = req.headers['x-worker-secret'];
    if (secretHeader !== WORKER_SECRET) {
        return res.status(401).json({ error: 'Unauthorized: Invalid worker secret token' });
    }
    next();
}
// Execute code endpoint
app.post('/api/execute', authWorker, async (req, res) => {
    try {
        const jobRequest = req.body;
        if (!jobRequest.language || !jobRequest.code || !Array.isArray(jobRequest.testCases)) {
            return res.status(400).json({
                success: false,
                verdict: 'Internal Execution Error',
                error: 'Invalid request: language, code, and testCases array are required'
            });
        }
        const result = await (0, sandbox_1.runIsolatedJob)(jobRequest);
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            verdict: 'Internal Execution Error',
            error: error.message || 'Worker server execution failure'
        });
    }
});
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`[Execution Worker] Running isolated sandbox service on port ${PORT}`);
    });
}
exports.default = app;
