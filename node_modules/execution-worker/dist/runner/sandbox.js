"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCompilerAvailability = checkCompilerAvailability;
exports.runIsolatedJob = runIsolatedJob;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEFAULT_GCC = fs.existsSync('C:\\Program Files\\CodeBlocks\\MinGW\\bin\\gcc.exe')
    ? 'C:\\Program Files\\CodeBlocks\\MinGW\\bin\\gcc.exe'
    : 'gcc';
const DEFAULT_GPP = fs.existsSync('C:\\Program Files\\CodeBlocks\\MinGW\\bin\\g++.exe')
    ? 'C:\\Program Files\\CodeBlocks\\MinGW\\bin\\g++.exe'
    : 'g++';
const GCC_PATH = process.env.GCC_PATH || DEFAULT_GCC;
const GPP_PATH = process.env.GPP_PATH || DEFAULT_GPP;
const JAVAC_PATH = process.env.JAVAC_PATH || 'javac';
const JAVA_PATH = process.env.JAVA_PATH || 'java';
const PYTHON_PATH = process.env.PYTHON_PATH || 'python';
const NODE_PATH = process.env.NODE_PATH || 'node';
const SANDBOX_BASE = path.join(__dirname, '..', '..', 'temp_sandbox');
// Ensure base sandbox dir exists
if (!fs.existsSync(SANDBOX_BASE)) {
    fs.mkdirSync(SANDBOX_BASE, { recursive: true });
}
function normalizeOutput(str) {
    return str
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n')
        .trim();
}
function killProcessTree(proc) {
    try {
        if (!proc.pid)
            return;
        if (process.platform === 'win32') {
            (0, child_process_1.spawn)('taskkill', ['/pid', proc.pid.toString(), '/T', '/F']);
        }
        else {
            proc.kill('SIGKILL');
        }
    }
    catch (err) {
        // Ignore cleanup error
    }
}
function executeProcess(command, args, cwd, input = '', timeoutMs = 5000, maxOutputBytes = 512 * 1024) {
    return new Promise((resolve) => {
        const startTime = process.hrtime.bigint();
        let stdout = '';
        let stderr = '';
        let timedOut = false;
        let isFinished = false;
        const child = (0, child_process_1.spawn)(command, args, {
            cwd,
            windowsHide: true,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        const timer = setTimeout(() => {
            timedOut = true;
            killProcessTree(child);
        }, timeoutMs);
        if (input && child.stdin) {
            child.stdin.write(input);
            child.stdin.end();
        }
        else if (child.stdin) {
            child.stdin.end();
        }
        child.stdout?.on('data', (data) => {
            if (stdout.length < maxOutputBytes) {
                stdout += data.toString('utf-8');
            }
        });
        child.stderr?.on('data', (data) => {
            if (stderr.length < maxOutputBytes) {
                stderr += data.toString('utf-8');
            }
        });
        const finish = (code) => {
            if (isFinished)
                return;
            isFinished = true;
            clearTimeout(timer);
            const endTime = process.hrtime.bigint();
            const durationMs = Number((endTime - startTime) / BigInt(1_000_000));
            resolve({ stdout, stderr, exitCode: code, timedOut, durationMs });
        };
        child.on('error', (err) => {
            stderr += '\nProcess error: ' + err.message;
            finish(1);
        });
        child.on('close', (code) => {
            finish(code);
        });
    });
}
async function checkCompilerAvailability() {
    const check = async (cmd, args) => {
        try {
            const res = await executeProcess(cmd, args, process.cwd(), '', 2000);
            return res.exitCode === 0;
        }
        catch {
            return false;
        }
    };
    const [cAvail, cppAvail, javaAvail, pyAvail, jsAvail] = await Promise.all([
        check(GCC_PATH, ['--version']),
        check(GPP_PATH, ['--version']),
        check(JAVAC_PATH, ['-version']),
        check(PYTHON_PATH, ['--version']),
        check(NODE_PATH, ['--version'])
    ]);
    return {
        c: cAvail,
        cpp: cppAvail,
        java: javaAvail,
        python: pyAvail,
        javascript: jsAvail
    };
}
async function runIsolatedJob(req) {
    const { language, code, testCases, timeLimitMs = 4000, memoryLimitMb = 256 } = req;
    const executionId = (0, uuid_1.v4)();
    const sandboxDir = path.join(SANDBOX_BASE, executionId);
    try {
        fs.mkdirSync(sandboxDir, { recursive: true });
        let sourceFileName = '';
        let compileCommand = null;
        let compileArgs = [];
        let runCommand = '';
        let runArgs = [];
        switch (language) {
            case 'c':
                sourceFileName = 'main.c';
                compileCommand = GCC_PATH;
                compileArgs = ['main.c', '-O2', '-o', 'solution.exe', '-lm'];
                runCommand = path.join(sandboxDir, 'solution.exe');
                runArgs = [];
                break;
            case 'cpp':
                sourceFileName = 'main.cpp';
                compileCommand = GPP_PATH;
                compileArgs = ['main.cpp', '-O2', '-std=c++17', '-o', 'solution.exe', '-lm'];
                runCommand = path.join(sandboxDir, 'solution.exe');
                runArgs = [];
                break;
            case 'java':
                sourceFileName = 'Main.java';
                compileCommand = JAVAC_PATH;
                compileArgs = ['Main.java'];
                runCommand = JAVA_PATH;
                runArgs = ['-Xmx256m', '-cp', '.', 'Main'];
                break;
            case 'python':
                sourceFileName = 'solution.py';
                runCommand = PYTHON_PATH;
                runArgs = ['-u', 'solution.py'];
                break;
            case 'javascript':
                sourceFileName = 'solution.js';
                runCommand = NODE_PATH;
                runArgs = ['solution.js'];
                break;
            default:
                return {
                    success: false,
                    verdict: 'Internal Execution Error',
                    testCaseResults: [],
                    totalTests: 0,
                    passedTests: 0,
                    totalExecutionTimeMs: 0,
                    peakMemoryKb: 0,
                    error: `Unsupported programming language: ${language}`
                };
        }
        // Write source code
        const sourceFilePath = path.join(sandboxDir, sourceFileName);
        fs.writeFileSync(sourceFilePath, code, 'utf-8');
        // Compilation step if applicable
        if (compileCommand) {
            const compileRes = await executeProcess(compileCommand, compileArgs, sandboxDir, '', 10000);
            if (compileRes.exitCode !== 0) {
                return {
                    success: false,
                    verdict: 'Compilation Error',
                    compileOutput: (compileRes.stderr || compileRes.stdout).trim(),
                    testCaseResults: [],
                    totalTests: testCases.length,
                    passedTests: 0,
                    totalExecutionTimeMs: compileRes.durationMs,
                    peakMemoryKb: 0
                };
            }
        }
        // Execute test cases
        const testCaseResults = [];
        let overallVerdict = 'Accepted';
        let passedTests = 0;
        let totalTime = 0;
        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            const execRes = await executeProcess(runCommand, runArgs, sandboxDir, tc.input || '', timeLimitMs);
            totalTime += execRes.durationMs;
            let tcVerdict = 'Accepted';
            let errorMsg = undefined;
            if (execRes.timedOut) {
                tcVerdict = 'Time Limit Exceeded';
                errorMsg = `Execution timed out after ${timeLimitMs}ms`;
            }
            else if (execRes.exitCode !== 0) {
                tcVerdict = 'Runtime Error';
                errorMsg = execRes.stderr.trim() || `Process exited with error code ${execRes.exitCode}`;
            }
            else {
                const actual = normalizeOutput(execRes.stdout);
                const expected = normalizeOutput(tc.expectedOutput);
                if (actual === expected) {
                    tcVerdict = 'Accepted';
                    passedTests++;
                }
                else {
                    tcVerdict = 'Wrong Answer';
                }
            }
            if (tcVerdict !== 'Accepted' && overallVerdict === 'Accepted') {
                overallVerdict = tcVerdict;
            }
            testCaseResults.push({
                testCaseId: tc.id || `tc_${i + 1}`,
                passed: tcVerdict === 'Accepted',
                actualOutput: execRes.stdout,
                expectedOutput: tc.expectedOutput,
                isHidden: tc.isHidden || false,
                executionTimeMs: execRes.durationMs,
                status: tcVerdict,
                errorMessage: errorMsg
            });
        }
        return {
            success: true,
            verdict: overallVerdict,
            testCaseResults,
            totalTests: testCases.length,
            passedTests,
            totalExecutionTimeMs: totalTime,
            peakMemoryKb: 1024 * 16 // approximate baseline
        };
    }
    catch (error) {
        return {
            success: false,
            verdict: 'Internal Execution Error',
            testCaseResults: [],
            totalTests: testCases.length,
            passedTests: 0,
            totalExecutionTimeMs: 0,
            peakMemoryKb: 0,
            error: error.message || 'Unknown sandbox execution error'
        };
    }
    finally {
        // Clean up sandbox folder safely
        try {
            if (fs.existsSync(sandboxDir)) {
                fs.rmSync(sandboxDir, { recursive: true, force: true });
            }
        }
        catch {
            // Ignore directory cleanup locking on Windows
        }
    }
}
