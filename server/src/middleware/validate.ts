import { Request, Response, NextFunction } from 'express';

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Email, password, and name are required' });
    return;
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }

  if (typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  next();
}

export function validateProject(req: Request, res: Response, next: NextFunction): void {
  const { name, domain } = req.body;

  if (!name || !domain) {
    res.status(400).json({ error: 'Project name and domain are required' });
    return;
  }

  next();
}

export function validateEvents(req: Request, res: Response, next: NextFunction): void {
  const { events } = req.body;

  if (!Array.isArray(events) || events.length === 0) {
    res.status(400).json({ error: 'Events array is required and must not be empty' });
    return;
  }

  if (events.length > 100) {
    res.status(400).json({ error: 'Maximum 100 events per batch' });
    return;
  }

  for (const event of events) {
    if (!event.eventType || !event.pageUrl) {
      res.status(400).json({ error: 'Each event must have eventType and pageUrl' });
      return;
    }
  }

  next();
}
