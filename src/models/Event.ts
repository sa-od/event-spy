import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEvent extends Document {
  projectId: Types.ObjectId;
  eventType: string;
  elementTag?: string;
  elementId?: string;
  elementClass?: string;
  elementText?: string;
  pageUrl: string;
  referrer?: string;
  visitorId: string;
  sessionId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const eventSchema = new Schema<IEvent>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  eventType: { type: String, required: true },
  elementTag: { type: String },
  elementId: { type: String },
  elementClass: { type: String },
  elementText: { type: String },
  pageUrl: { type: String, required: true },
  referrer: { type: String },
  visitorId: { type: String, required: true },
  sessionId: { type: String, required: true },
  timestamp: { type: Date, required: true },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

eventSchema.index({ projectId: 1, timestamp: -1 });
eventSchema.index({ projectId: 1, eventType: 1 });

export default mongoose.models.Event as mongoose.Model<IEvent> ||
  mongoose.model<IEvent>('Event', eventSchema);
