import { Response, NextFunction } from 'express';
import Project from '../models/Project';
import { ApiKeyRequest } from '../types';

export async function apiKeyMiddleware(req: ApiKeyRequest, res: Response, next: NextFunction): Promise<void> {
  const apiKey = (req.headers['x-api-key'] as string) || (req.query.key as string);

  if (!apiKey) {
    res.status(401).json({ error: 'API key required' });
    return;
  }

  try {
    const project = await Project.findOne({ apiKey });
    if (!project) {
      res.status(401).json({ error: 'Invalid API key' });
      return;
    }
    req.project = project;
    next();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
}
