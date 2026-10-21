import mongoose, { Schema, Document } from 'mongoose';

export interface ITestCase extends Document {
  questionId: mongoose.Types.ObjectId;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  weight: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema = new Schema<ITestCase>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
    input: { type: String, default: '' },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false, index: true },
    weight: { type: Number, default: 1 },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

TestCaseSchema.index({ questionId: 1, isHidden: 1 });

export const TestCase = mongoose.model<ITestCase>('TestCase', TestCaseSchema);

