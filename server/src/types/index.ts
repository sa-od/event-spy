import { Request } from 'express';
import { Types } from 'mongoose';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface ApiKeyRequest extends Request {
  project?: {
    _id: Types.ObjectId;
    name: string;
    apiKey: string;
    userId: Types.ObjectId;
  };
}
