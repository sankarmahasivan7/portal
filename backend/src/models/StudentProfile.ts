import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  studentId: string;
  department: string;
  batch: string;
  semester: number;
  year?: number; // 1, 2, 3, 4
  enrollmentNumber: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    studentId: { type: String, required: true, unique: true, index: true },
    department: { type: String, required: true, default: 'Computer Science and Engineering' },
    batch: { type: String, required: true, default: '2022-2026' },
    semester: { type: Number, required: true, default: 6 },
    year: { type: Number, default: 3, min: 1, max: 4, index: true },
    enrollmentNumber: { type: String, required: true, unique: true },
    phone: { type: String }
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);

