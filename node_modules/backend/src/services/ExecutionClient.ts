import axios from 'axios';

export interface WorkerTestCaseInput {
  id?: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  weight?: number;
}

export interface WorkerExecutionRequest {
  language: string;
  code: string;
  testCases: WorkerTestCaseInput[];
  timeLimitMs?: number;
  memoryLimitMb?: number;
}

export interface WorkerTestCaseResult {
  testCaseId?: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput?: string;
  isHidden?: boolean;
  executionTimeMs: number;
  status: string;
  errorMessage?: string;
}

export interface WorkerExecutionResponse {
  success: boolean;
  verdict: string;
  compileOutput?: string;
  testCaseResults: WorkerTestCaseResult[];
  totalTests: number;
  passedTests: number;
  totalExecutionTimeMs: number;
  peakMemoryKb: number;
  error?: string;
}

const WORKER_URL = process.env.EXECUTION_WORKER_URL || 'http://localhost:5050';
const WORKER_SECRET = process.env.EXECUTION_WORKER_SECRET || 'isolated_worker_internal_secret_998877';

export async function executeCodeInWorker(
  req: WorkerExecutionRequest
): Promise<WorkerExecutionResponse> {
  try {
    const response = await axios.post<WorkerExecutionResponse>(
      `${WORKER_URL}/api/execute`,
      req,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-worker-secret': WORKER_SECRET
        },
        timeout: 30000 // 30s HTTP timeout
      }
    );
    return response.data;
  } catch (error: any) {
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

export async function checkWorkerHealth(): Promise<{ healthy: boolean; details?: any }> {
  try {
    const response = await axios.get(`${WORKER_URL}/health`, { timeout: 3000 });
    return { healthy: response.status === 200, details: response.data };
  } catch (error: any) {
    return { healthy: false, details: { error: error.message } };
  }
}

