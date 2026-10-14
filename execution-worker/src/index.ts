import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runIsolatedJob, checkCompilerAvailability } from './runner/sandbox';
import { ExecutionJobRequest } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const WORKER_SECRET = process.env.WORKER_SECRET || 'isolated_worker_internal_secret_998877';

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Healthcheck and compiler detection endpoint
app.get('/health', async (_req: Request, res: Response) => {
  const compilers = await checkCompilerAvailability();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'college-ps-execution-worker',
    compilers
  });
});

// Authentication middleware for worker
function authWorker(req: Request, res: Response, next: Function) {
  const secretHeader = req.headers['x-worker-secret'];
  if (secretHeader !== WORKER_SECRET) {
    return res.status(401).json({ error: 'Unauthorized: Invalid worker secret token' });
  }
  next();
}

// Execute code endpoint
app.post('/api/execute', authWorker, async (req: Request, res: Response) => {
  try {
    const jobRequest: ExecutionJobRequest = req.body;
    if (!jobRequest.language || !jobRequest.code || !Array.isArray(jobRequest.testCases)) {
      return res.status(400).json({
        success: false,
        verdict: 'Internal Execution Error',
        error: 'Invalid request: language, code, and testCases array are required'
      });
    }

    const result = await runIsolatedJob(jobRequest);
    return res.json(result);
  } catch (error: any) {
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

export default app;

