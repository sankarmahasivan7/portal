import mongoose, { Schema, Document } from 'mongoose';

export interface IExecutionLimits {
  timeLimitMs: number;
  memoryLimitMb: number;
}

export interface IExamination extends Document {
  title: string;
  description: string;
  languageId: mongoose.Types.ObjectId;
  levelNumber: number; // 1 to 6
  registrationStartDate: Date;
  registrationEndDate: Date;
  examDate: Date;
  durationMinutes: number;
  maxStudents: number;
  passingPercentage: number;
  questions: mongoose.Types.ObjectId[];
  allowedLanguages: string[];
  executionLimits: IExecutionLimits;
  instructions: string;
  retakeAllowed: boolean;
  maxAttempts: number;
  isPublished: boolean;
  sebRequired: boolean;
  sebConfigKey?: string;
  collegeNetworkOnly: boolean;
  allowedIpRanges?: string[];
  showResultsImmediately: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExaminationSchema = new Schema<IExamination>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    languageId: { type: Schema.Types.ObjectId, ref: 'ProgrammingLanguage', required: true, index: true },
    levelNumber: { type: Number, required: true, index: true },
    registrationStartDate: { type: Date, required: true },
    registrationEndDate: { type: Date, required: true },
    examDate: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, default: 60 },
    maxStudents: { type: Number, default: 100 },
    passingPercentage: { type: Number, required: true, default: 100, min: 1, max: 100 },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    allowedLanguages: [{ type: String }],
    executionLimits: {
      timeLimitMs: { type: Number, default: 4000 },
      memoryLimitMb: { type: Number, default: 256 }
    },
    instructions: { type: String, default: 'Read each problem carefully. Ensure your solution passes all constraints.' },
    retakeAllowed: { type: Boolean, default: true },
    maxAttempts: { type: Number, default: 3 },
    isPublished: { type: Boolean, default: false, index: true },
    sebRequired: { type: Boolean, default: false },
    sebConfigKey: { type: String },
    collegeNetworkOnly: { type: Boolean, default: false },
    allowedIpRanges: [{ type: String }],
    showResultsImmediately: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Examination = mongoose.model<IExamination>('Examination', ExaminationSchema);

