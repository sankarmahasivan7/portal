import mongoose, { Schema, Document } from 'mongoose';

export type RegistrationStatus = 'registered' | 'cancelled' | 'attended' | 'absent';

export interface IExaminationRegistration extends Document {
  examinationId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId; // User._id
  status: RegistrationStatus;
  registeredAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExaminationRegistrationSchema = new Schema<IExaminationRegistration>(
  {
    examinationId: { type: Schema.Types.ObjectId, ref: 'Examination', required: true, index: true },
    slotId: { type: Schema.Types.ObjectId, ref: 'ExaminationSlot', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['registered', 'cancelled', 'attended', 'absent'], default: 'registered' },
    registeredAt: { type: Date, default: Date.now },
    cancelledAt: { type: Date },
    cancellationReason: { type: String }
  },
  { timestamps: true }
);

// Unique compound index: a student can have at most one active registration per examination
ExaminationRegistrationSchema.index({ examinationId: 1, studentId: 1 }, { unique: true });

export const ExaminationRegistration = mongoose.model<IExaminationRegistration>(
  'ExaminationRegistration',
  ExaminationRegistrationSchema
);

