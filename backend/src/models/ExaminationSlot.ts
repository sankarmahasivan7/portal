import mongoose, { Schema, Document } from 'mongoose';

export interface IExaminationSlot extends Document {
  examinationId: mongoose.Types.ObjectId[] | any;
  slotName: string; // e.g. "09:15 to 10:15 - Lab 1"
  labName: string; // "Lab 1", "Lab 2", "Lab 3"
  timeWindow: string; // "09:15 to 10:15", "10:25 to 11:25", "11:35 to 12:35", "1:30 to 2:30", "2:45 to 3:45"
  startTime: Date;
  endTime: Date;
  capacity: number; // strictly 30 per lab
  registeredCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExaminationSlotSchema = new Schema<IExaminationSlot>(
  {
    examinationId: [{ type: Schema.Types.ObjectId, ref: 'Examination', index: true }],
    slotName: { type: String, required: true, trim: true },
    labName: { type: String, default: 'Lab 1', index: true },
    timeWindow: { type: String, default: '09:15 to 10:15', index: true },
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
