import mongoose, { Schema, Document } from 'mongoose';

export interface IProgrammingLanguage extends Document {
  name: string; // e.g. "C", "C++", "Java", "Python", "JavaScript"
  slug: string; // e.g. "c", "cpp", "java", "python", "javascript"
  executionEngineId: string; // "c", "cpp", "java", "python", "javascript"
  totalLevels: number; // 6 for C, C++, Java, Python; 4 for others by default
  isEnabled: boolean;
  defaultTimeLimitMs: number;
  defaultMemoryLimitMb: number;
  monacoLanguage: string; // "c", "cpp", "java", "python", "javascript"
  templateCode: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProgrammingLanguageSchema = new Schema<IProgrammingLanguage>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    executionEngineId: { type: String, required: true },
    totalLevels: { type: Number, required: true, default: 6 },
    isEnabled: { type: Boolean, default: true, index: true },
    defaultTimeLimitMs: { type: Number, default: 4000 },
    defaultMemoryLimitMb: { type: Number, default: 256 },
    monacoLanguage: { type: String, default: 'plaintext' },
    templateCode: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

export const ProgrammingLanguage = mongoose.model<IProgrammingLanguage>(
  'ProgrammingLanguage',
  ProgrammingLanguageSchema
);

