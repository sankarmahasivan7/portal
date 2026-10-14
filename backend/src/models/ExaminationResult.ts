import mongoose, { Schema, Document } from 'mongoose';

export interface IExaminationResult extends Document {
  sessionId: mongoose.Types.ObjectId;
  examinationId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  languageId: mongoose.Types.ObjectId;
  levelNumber: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  passed: boolean;
  passingPercentageRequired: number;
  submissions: mongoose.Types.ObjectId[];
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExaminationResultSchema = new Schema<IExaminationResult>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'ExaminationSession', required: true, unique: true, index: true },
    examinationId: { type: Schema.Types.ObjectId, ref: 'Examination', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    languageId: { type: Schema.Types.ObjectId, ref: 'ProgrammingLanguage', required: true, index: true },
    levelNumber: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    obtainedMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true, index: true },
    passingPercentageRequired: { type: Number, required: true },
    submissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }],
    verifiedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const ExaminationResult = mongoose.model<IExaminationResult>(
  'ExaminationResult',
  ExaminationResultSchema
);

