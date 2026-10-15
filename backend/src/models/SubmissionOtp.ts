import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmissionOtp extends Document {
  studentId?: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  examinationId?: mongoose.Types.ObjectId;
  otp: string;
  generatedAt: Date;
  expiresAt: Date;
  generatedBy: mongoose.Types.ObjectId;
  isUsed: boolean;
  usedAt?: Date;
  usedBySessions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionOtpSchema = new Schema<ISubmissionOtp>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'ExaminationSession' },
    examinationId: { type: Schema.Types.ObjectId, ref: 'Examination' },
    otp: { type: String, required: true, index: true },
    generatedAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true, index: true },
    generatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isUsed: { type: Boolean, default: false },
    usedAt: { type: Date },
    usedBySessions: [{ type: Schema.Types.ObjectId, ref: 'ExaminationSession' }]
  },
  { timestamps: true }
);

SubmissionOtpSchema.index({ otp: 1, expiresAt: 1 });

export const SubmissionOtp = mongoose.model<ISubmissionOtp>('SubmissionOtp', SubmissionOtpSchema);
