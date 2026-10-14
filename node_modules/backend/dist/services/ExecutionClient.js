"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCodeInWorker = executeCodeInWorker;
exports.checkWorkerHealth = checkWorkerHealth;
const axios_1 = __importDefault(require("axios"));
const WORKER_URL = process.env.EXECUTION_WORKER_URL || 'http://localhost:5050';
const WORKER_SECRET = process.env.EXECUTION_WORKER_SECRET || 'isolated_worker_internal_secret_998877';
async function executeCodeInWorker(req) {
    try {
        const response = await axios_1.default.post(`${WORKER_URL}/api/execute`, req, {
            headers: {
                'Content-Type': 'application/json',
                'x-worker-secret': WORKER_SECRET
            },
            timeout: 30000 // 30s HTTP timeout
        });
        return response.data;
    }
    catch (error) {
        console.error('[ExecutionClient] Failed to execute code in isolated worker:', error.message);
        if (error.response && error.response.data) {
            return error.response.data;
        }
        return {
            success: false,
            verdict: 'Internal Execution Error',
            testCaseResults: [],
            totalTests: req.testCases.length,
            passedTests: 0,
            totalExecutionTimeMs: 0,
            peakMemoryKb: 0,
            error: `Execution worker service is temporarily unavailable: ${error.message}`
        };
    }
}
async function checkWorkerHealth() {
    try {
        const response = await axios_1.default.get(`${WORKER_URL}/health`, { timeout: 3000 });
        return { healthy: response.status === 200, details: response.data };
    }
    catch (error) {
        return { healthy: false, details: { error: error.message } };
    }
}
