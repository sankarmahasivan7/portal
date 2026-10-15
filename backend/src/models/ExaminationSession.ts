import mongoose, { Schema, Document } from 'mongoose';

export type SessionStatus = 'active' | 'submitted' | 'expired' | 'terminated';

export interface IDraftCode {
  questionId: string;
  language: string;
  code: string;
  updatedAt: Date;
}

export interface IExaminationFeedback {
  rating: number;
  difficulty?: 'easy' | 'moderate' | 'hard' | 'very_hard';
  comments?: string;
  submittedAt: Date;
  verifiedOtp?: string;
  verifiedByFaculty?: mongoose.Types.ObjectId;
}

export interface IExaminationSession extends Document {
  examinationId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  startedAt: Date;
  deadline: Date; // Authoritative deadline calculated on server
  finishedAt?: Date;
  status: SessionStatus;
  drafts: Map<string, { code: string; language: string; updatedAt: Date }>;
  ipAddress?: string;
  userAgent?: string;
  sebVerified: boolean;
  attemptNumber: number;
  feedback?: IExaminationFeedback;
  createdAt: Date;
  updatedAt: Date;
}

const ExaminationSessionSchema = new Schema<IExaminationSession>(
  {
    examinationId: { type: Schema.Types.ObjectId, ref: 'Examination', required: true, index: true },
    slotId: { type: Schema.Types.ObjectId, ref: 'ExaminationSlot', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startedAt: { type: Date, required: true, default: Date.now },
    deadline: { type: Date, required: true },
    finishedAt: { type: Date },
    status: {
      type: String,
      enum: ['active', 'submitted', 'expired', 'terminated'],
      default: 'active',
      index: true
    },
    drafts: {
      type: Map,
      of: new Schema({
        code: { type: String, default: '' },
        language: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now }
      }),
      default: {}
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    sebVerified: { type: Boolean, default: false },
    attemptNumber: { type: Number, default: 1 },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      difficulty: { type: String, enum: ['easy', 'moderate', 'hard', 'very_hard'] },
      comments: { type: String, default: '' },
      submittedAt: { type: Date },
      verifiedOtp: { type: String },
      verifiedByFaculty: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  },
  { timestamps: true }
);

export const ExaminationSession = mongoose.model<IExaminationSession>(
  'ExaminationSession',
  ExaminationSessionSchema
);

