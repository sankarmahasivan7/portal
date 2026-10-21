import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ExecutionJobRequest, ExecutionJobResponse, TestCaseExecutionResult, ExecutionVerdict } from '../types';

import dotenv from 'dotenv';
dotenv.config();

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

function stripAnsi(str: string): string {
  if (!str) return '';
  return str.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '');
}

function cleanDiagnostics(text: string, sandboxDir: string): string {
  if (!text) return '';
  const noAnsi = stripAnsi(text);
  // Replace absolute sandbox path with clean relative filename
  const escaped = sandboxDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped + '[\\\\/]?', 'gi');
  return noAnsi.replace(regex, '').trim();
}

function normalizeOutput(str: string): string {
  return stripAnsi(str)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

function killProcessTree(proc: ChildProcess): void {
  try {
    if (!proc.pid) return;
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', proc.pid.toString(), '/T', '/F']);
    } else {
      proc.kill('SIGKILL');
    }
  } catch (err) {
    // Ignore cleanup error
  }
}

interface CommandRunResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  durationMs: number;
}

function executeProcess(
  command: string,
  args: string[],
  cwd: string,
  input: string = '',
  timeoutMs: number = 5000,
  maxOutputBytes: number = 512 * 1024
): Promise<CommandRunResult> {
  return new Promise((resolve) => {
    const startTime = process.hrtime.bigint();
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let isFinished = false;

    const child = spawn(command, args, {
      cwd,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        NODE_DISABLE_COLORS: '1',
        FORCE_COLOR: '0',
        PYTHONUNBUFFERED: '1'
      }
    });

    const timer = setTimeout(() => {
      timedOut = true;
      killProcessTree(child);
    }, timeoutMs);

    if (input && child.stdin) {
      child.stdin.write(input);
      child.stdin.end();
    } else if (child.stdin) {
      child.stdin.end();
    }

    child.stdout?.on('data', (data: Buffer) => {
      if (stdout.length < maxOutputBytes) {
        stdout += data.toString('utf-8');
      }
    });

    child.stderr?.on('data', (data: Buffer) => {
      if (stderr.length < maxOutputBytes) {
        stderr += data.toString('utf-8');
      }
    });

    const finish = (code: number | null) => {
      if (isFinished) return;
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

export async function checkCompilerAvailability(): Promise<Record<string, boolean>> {
  const check = async (cmd: string, args: string[]): Promise<boolean> => {
    try {
      const res = await executeProcess(cmd, args, process.cwd(), '', 2000);
      return res.exitCode === 0;
    } catch {
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

export async function runIsolatedJob(req: ExecutionJobRequest): Promise<ExecutionJobResponse> {
  const { language, code, testCases, timeLimitMs = 4000, memoryLimitMb = 256 } = req;
  const executionId = uuidv4();
  const sandboxDir = path.join(SANDBOX_BASE, executionId);

  try {
    fs.mkdirSync(sandboxDir, { recursive: true });

    let sourceFileName = '';
    let compileCommand: string | null = null;
    let compileArgs: string[] = [];
    let runCommand = '';
    let runArgs: string[] = [];

    switch (language) {
      case 'c':
        sourceFileName = 'main.c';
        compileCommand = GCC_PATH;
        compileArgs = ['main.c', '-O2', '-static', '-static-libgcc', '-o', 'solution.exe', '-lm'];
        runCommand = path.join(sandboxDir, 'solution.exe');
        runArgs = [];
        break;

      case 'cpp':
        sourceFileName = 'main.cpp';
        compileCommand = GPP_PATH;
        compileArgs = ['main.cpp', '-O2', '-std=c++17', '-static', '-static-libgcc', '-static-libstdc++', '-o', 'solution.exe', '-lm'];
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
          error: `Unsupported programming language: ${language}`,
          errorLog: `Unsupported programming language: ${language}`
        };
    }

    // Write source code
    const sourceFilePath = path.join(sandboxDir, sourceFileName);
    fs.writeFileSync(sourceFilePath, code, 'utf-8');

    // Compilation step if applicable
    if (compileCommand) {
      const compileRes = await executeProcess(compileCommand, compileArgs, sandboxDir, '', 10000);
      if (compileRes.exitCode !== 0) {
        const rawOutput = (compileRes.stderr || compileRes.stdout).trim();
        const cleaned = cleanDiagnostics(rawOutput, sandboxDir);
        return {
          success: false,
          verdict: 'Compilation Error',
          compileOutput: cleaned,
          errorLog: cleaned,
          testCaseResults: [],
          totalTests: testCases.length,
          passedTests: 0,
          totalExecutionTimeMs: compileRes.durationMs,
          peakMemoryKb: 0
        };
      }
    }

    // Execute test cases
    const testCaseResults: TestCaseExecutionResult[] = [];
    let overallVerdict: ExecutionVerdict = 'Accepted';
    let passedTests = 0;
    let totalTime = 0;
    let firstErrorLog = '';

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const execRes = await executeProcess(runCommand, runArgs, sandboxDir, tc.input || '', timeLimitMs);
      totalTime += execRes.durationMs;

      let tcVerdict: ExecutionVerdict = 'Accepted';
      let errorMsg: string | undefined = undefined;

      if (execRes.timedOut) {
        tcVerdict = 'Time Limit Exceeded';
        errorMsg = `Execution timed out after ${timeLimitMs}ms`;
      } else if (execRes.exitCode !== 0) {
        tcVerdict = 'Runtime Error';
        const rawErr = (execRes.stderr || execRes.stdout).trim();
        errorMsg = cleanDiagnostics(rawErr, sandboxDir) || `Process exited with error code ${execRes.exitCode}`;
      } else {
        const actual = normalizeOutput(execRes.stdout);
        const expected = normalizeOutput(tc.expectedOutput);
        if (actual === expected) {
          tcVerdict = 'Accepted';
          passedTests++;
        } else {
          tcVerdict = 'Wrong Answer';
        }
      }

      if (tcVerdict !== 'Accepted' && overallVerdict === 'Accepted') {
        overallVerdict = tcVerdict;
      }

      if (errorMsg && !firstErrorLog) {
        firstErrorLog = errorMsg;
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
      success: overallVerdict === 'Accepted',
      verdict: overallVerdict,
      errorLog: firstErrorLog || undefined,
      testCaseResults,
      totalTests: testCases.length,
      passedTests,
      totalExecutionTimeMs: totalTime,
      peakMemoryKb: 1024 * 16 // approximate baseline
    };
  } catch (error: any) {
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
  } finally {
    // Clean up sandbox folder safely
    try {
      if (fs.existsSync(sandboxDir)) {
        fs.rmSync(sandboxDir, { recursive: true, force: true });
      }
    } catch {
      // Ignore directory cleanup locking on Windows
    }
  }
}
