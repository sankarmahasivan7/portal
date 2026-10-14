import mongoose, { Schema, Document } from 'mongoose';

export interface IExaminationSlot extends Document {
  examinationId: mongoose.Types.ObjectId;
  slotName: string; // e.g. "09:15 - 10:15 (Lab 1)"
  labName: string; // "Lab 1", "Lab 2", "Lab 3"
  timeWindow: string; // "09:15 - 10:15", "10:25 - 11:25", "11:35 - 12:35", "13:30 - 14:30", "14:45 - 15:45"
  startTime: Date;
  endTime: Date;
  capacity: number; // 30 per lab
  registeredCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExaminationSlotSchema = new Schema<IExaminationSlot>(
  {
    examinationId: { type: Schema.Types.ObjectId, ref: 'Examination', required: true, index: true },
    slotName: { type: String, required: true, trim: true },
    labName: { type: String, default: 'Lab 1', index: true },
    timeWindow: { type: String, default: '09:15 - 10:15', index: true },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true, index: true },
    capacity: { type: Number, required: true, default: 30, min: 1 },
    registeredCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ExaminationSlot = mongoose.model<IExaminationSlot>(
  'ExaminationSlot',
  ExaminationSlotSchema
);
