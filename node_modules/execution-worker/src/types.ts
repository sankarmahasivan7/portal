export type SupportedLanguage = 'c' | 'cpp' | 'java' | 'python' | 'javascript';

export type ExecutionVerdict =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Compilation Error'
  | 'Runtime Error'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'
  | 'Internal Execution Error';

export interface TestCaseInput {
  id?: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  weight?: number;
}

export interface TestCaseExecutionResult {
  testCaseId?: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput?: string;
  isHidden?: boolean;
  executionTimeMs: number;
  status: ExecutionVerdict;
  errorMessage?: string;
}

export interface ExecutionJobRequest {
  language: SupportedLanguage;
  code: string;
  testCases: TestCaseInput[];
  timeLimitMs?: number;
  memoryLimitMb?: number;
}

export interface ExecutionJobResponse {
  success: boolean;
  verdict: ExecutionVerdict;
  compileOutput?: string;
  testCaseResults: TestCaseExecutionResult[];
  totalTests: number;
  passedTests: number;
  totalExecutionTimeMs: number;
  peakMemoryKb: number;
  error?: string;
}

