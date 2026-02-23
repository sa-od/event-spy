import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProject extends Document {
  name: string;
  domain: string;
  apiKey: string;
  userId: Types.ObjectId;
  createdAt: Date;
}

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true, trim: true },
  domain: { type: String, required: true, trim: true },
  apiKey: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

projectSchema.index({ userId: 1 });

export default mongoose.model<IProject>('Project', projectSchema);
