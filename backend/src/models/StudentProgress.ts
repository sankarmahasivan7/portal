import mongoose, { Schema, Document } from 'mongoose';

export interface ICompletedLevelRecord {
  levelNumber: number;
  passedAt: Date;
  percentage: number;
  obtainedMarks: number;
  totalMarks: number;
  examinationId: mongoose.Types.ObjectId;
  resultId: mongoose.Types.ObjectId;
}

export interface IStudentProgress extends Document {
  studentId: mongoose.Types.ObjectId;
  languageId: mongoose.Types.ObjectId;
  highestUnlockedLevel: number; // Defaults to 1 (Level 1 has no prerequisite)
  completedLevels: ICompletedLevelRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const CompletedLevelRecordSchema = new Schema<ICompletedLevelRecord>(
  {
    levelNumber: { type: Number, required: true },
    passedAt: { type: Date, default: Date.now },
    percentage: { type: Number, required: true },
    obtainedMarks: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    examinationId: { type: Schema.Types.ObjectId, ref: 'Examination', required: true },
    resultId: { type: Schema.Types.ObjectId, ref: 'ExaminationResult', required: true }
  },
  { _id: false }
);

const StudentProgressSchema = new Schema<IStudentProgress>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    languageId: { type: Schema.Types.ObjectId, ref: 'ProgrammingLanguage', required: true, index: true },
    highestUnlockedLevel: { type: Number, default: 1, min: 1 },
    completedLevels: [CompletedLevelRecordSchema]
  },
  { timestamps: true }
);

// Compound unique index: one progress document per student per language
StudentProgressSchema.index({ studentId: 1, languageId: 1 }, { unique: true });

export const StudentProgress = mongoose.model<IStudentProgress>(
  'StudentProgress',
  StudentProgressSchema
);

