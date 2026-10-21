import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'student' | 'faculty' | 'controller' | 'admin';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  studentId?: string; // e.g. CS2026-042 for students
  department?: string;
  year?: number; // 1, 2, 3, 4
  section?: string;
  isActive: boolean;
  collegeIpExempt: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'controller', 'admin'], default: 'student', index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    studentId: { type: String, sparse: true, index: true },
    department: { type: String, default: 'Computer Science and Engineering', index: true },
    year: { type: Number, default: 1, min: 1, max: 4, index: true },
    section: { type: String, default: 'A' },
    isActive: { type: Boolean, default: true },
    collegeIpExempt: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

