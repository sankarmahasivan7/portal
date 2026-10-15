import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType =
  | 'registration'
  | 'reminder'
  | 'cancellation'
  | 'schedule_change'
  | 'result'
  | 'level_unlock'
  | 'attendance_verified'
  | 'exam_failed'
  | 'registration_cleared'
  | 'system';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'registration',
        'reminder',
        'cancellation',
        'schedule_change',
        'result',
        'level_unlock',
        'attendance_verified',
        'exam_failed',
        'registration_cleared',
        'system'
      ],
      default: 'system'
    },
    metadata: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

