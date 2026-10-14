import mongoose, { Schema, Document } from 'mongoose';

export type SubmissionVerdict =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Compilation Error'
  | 'Runtime Error'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'
  | 'Internal Execution Error';

export interface ISubmissionTestCaseResult {
  testCaseId: mongoose.Types.ObjectId;
  passed: boolean;
  actualOutput?: string;
  expectedOutput?: string; // Kept in DB for faculty/admin review, stripped for students if hidden
  isHidden: boolean;
  executionTimeMs: number;
  status: SubmissionVerdict;
  errorMessage?: string;
}

export interface ISubmission extends Document {
  sessionId: mongoose.Types.ObjectId;
  examinationId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  language: string;
  code: string;
  verdict: SubmissionVerdict;
  score: number;
  maxScore: number;
  testCaseResults: ISubmissionTestCaseResult[];
  compileOutput?: string;
  totalExecutionTimeMs: number;
  isFinal: boolean;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'ExaminationSession', required: true, index: true },
    examinationId: { type: Schema.Types.ObjectId, ref: 'Examination', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    verdict: {
      type: String,
      enum: [
        'Accepted',
        'Wrong Answer',
        'Compilation Error',
        'Runtime Error',
        'Time Limit Exceeded',
        'Memory Limit Exceeded',
        'Internal Execution Error'
      ],
      required: true,
      index: true
    },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 100 },
    testCaseResults: [
      {
        testCaseId: { type: Schema.Types.ObjectId, ref: 'TestCase', required: true },
        passed: { type: Boolean, required: true },
        actualOutput: { type: String },
        expectedOutput: { type: String },
        isHidden: { type: Boolean, default: false },
        executionTimeMs: { type: Number, default: 0 },
        status: { type: String },
        errorMessage: { type: String }
      }
    ],
    compileOutput: { type: String },
    totalExecutionTimeMs: { type: Number, default: 0 },
    isFinal: { type: Boolean, default: true },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);

