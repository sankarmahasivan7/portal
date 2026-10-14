import mongoose, { Schema, Document } from 'mongoose';

export interface IPlatformConfiguration extends Document {
  key: string; // "global_config"
  collegeNetworkRanges: string[]; // e.g. ["127.0.0.1", "::1", "10.0.0.0/8", "192.168.0.0/16"]
  sebEnforced: boolean;
  sebConfigKey?: string;
  sebQuitPassword?: string;
  defaultTimeZone: string; // "Asia/Kolkata"
  allowStudentSelfRegistration: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const PlatformConfigurationSchema = new Schema<IPlatformConfiguration>(
  {
    key: { type: String, required: true, unique: true, default: 'global_config' },
    collegeNetworkRanges: {
      type: [String],
      default: ['127.0.0.1', '::1', '10.0.0.0/8', '192.168.0.0/16']
    },
    sebEnforced: { type: Boolean, default: false },
    sebConfigKey: { type: String, default: '' },
    sebQuitPassword: { type: String, default: 'CollegeExamQuit2026' },
    defaultTimeZone: { type: String, default: 'Asia/Kolkata' },
    allowStudentSelfRegistration: { type: Boolean, default: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const PlatformConfiguration = mongoose.model<IPlatformConfiguration>(
  'PlatformConfiguration',
  PlatformConfigurationSchema
);

