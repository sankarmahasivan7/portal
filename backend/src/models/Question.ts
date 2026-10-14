import mongoose, { Schema, Document } from 'mongoose';

export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface IQuestionExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface IQuestion extends Document {
  title: string;
  slug: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: IQuestionExample[];
  allowedLanguages: string[]; // e.g. ['c', 'cpp', 'java', 'python']
  languageId?: mongoose.Types.ObjectId; // specific language if language-specific
  targetLevel: number; // e.g. 1, 2, 3...
  difficulty: QuestionDifficulty;
  marks: number;
  timeLimitMs?: number;
  memoryLimitMb?: number;
  isDraft: boolean;
  isArchived: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    inputFormat: { type: String, required: true },
    outputFormat: { type: String, required: true },
    constraints: { type: String, required: true },
    examples: [
      {
        input: { type: String, default: '' },
        output: { type: String, default: '' },
        explanation: { type: String, default: '' }
      }
    ],
    allowedLanguages: [{ type: String }],
    languageId: { type: Schema.Types.ObjectId, ref: 'ProgrammingLanguage' },
    targetLevel: { type: Number, default: 1 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    marks: { type: Number, required: true, default: 100 },
    timeLimitMs: { type: Number },
    memoryLimitMb: { type: Number },
    isDraft: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

