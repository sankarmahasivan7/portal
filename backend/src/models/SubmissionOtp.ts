import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmissionOtp extends Document {
  studentId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  examinationId?: mongoose.Types.ObjectId;
  otp: string;
  generatedAt: Date;
  expiresAt: Date;
  generatedBy: mongoose.Types.ObjectId;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionOtpSchema = new Schema<ISubmissionOtp>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'ExaminationSession' },
    examinationId: { type: Schema.Types.ObjectId, ref: 'Examination' },
    otp: { type: String, required: true },
    generatedAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true },
    generatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isUsed: { type: Boolean, default: false },
    usedAt: { type: Date }
  },
  { timestamps: true }
);

SubmissionOtpSchema.index({ studentId: 1, isUsed: 1, expiresAt: 1 });

export const SubmissionOtp = mongoose.model<ISubmissionOtp>('SubmissionOtp', SubmissionOtpSchema);
