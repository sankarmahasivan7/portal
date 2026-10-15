import mongoose, { Schema, Document } from 'mongoose';

export interface IProgrammingLevel extends Document {
  languageId: mongoose.Types.ObjectId;
  levelNumber: number; // 1 to totalLevels
  title: string; // e.g. "Level 1: Fundamentals & Basic I/O"
  description: string;
  defaultPassingPercentage: number;
  prerequisiteLevel?: number; // Level 1 has none (null/0), Level 2 requires 1, etc.
  createdAt: Date;
  updatedAt: Date;
}

const ProgrammingLevelSchema = new Schema<IProgrammingLevel>(
  {
    languageId: { type: Schema.Types.ObjectId, ref: 'ProgrammingLanguage', required: true, index: true },
    levelNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    defaultPassingPercentage: { type: Number, default: 100, min: 1, max: 100 },
    prerequisiteLevel: { type: Number, default: null }
  },
  { timestamps: true }
);

// Compound unique index so each language has unique level numbers
ProgrammingLevelSchema.index({ languageId: 1, levelNumber: 1 }, { unique: true });

export const ProgrammingLevel = mongoose.model<IProgrammingLevel>(
  'ProgrammingLevel',
  ProgrammingLevelSchema
);

