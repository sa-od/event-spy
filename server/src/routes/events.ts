import { Router, Response } from 'express';
import Event from '../models/Event';
import Project from '../models/Project';
import { authMiddleware } from '../middleware/auth';
import { apiKeyMiddleware } from '../middleware/apiKey';
import { validateEvents } from '../middleware/validate';
import { AuthRequest, ApiKeyRequest } from '../types';

const router = Router();

// SDK endpoint — protected by API key
router.post('/batch', apiKeyMiddleware, validateEvents, async (req: ApiKeyRequest, res: Response) => {
  try {
    const { events } = req.body;

    const docs = events.map((event: Record<string, unknown>) => ({
      ...event,
      projectId: req.project!._id,
      timestamp: event.timestamp || new Date(),
    }));

    await Event.insertMany(docs);

    res.status(201).json({ inserted: docs.length });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Dashboard endpoint — protected by auth
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, eventType, pageUrl, startDate, endDate, page = '1', limit = '50' } = req.query;

    if (!projectId) {
      res.status(400).json({ error: 'projectId is required' });
      return;
    }

    // Verify user owns the project
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const filter: Record<string, unknown> = { projectId };

    if (eventType) filter.eventType = eventType;
    if (pageUrl) filter.pageUrl = { $regex: pageUrl, $options: 'i' };
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) (filter.timestamp as Record<string, unknown>).$gte = new Date(startDate as string);
      if (endDate) (filter.timestamp as Record<string, unknown>).$lte = new Date(endDate as string);
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(parseInt(limit as string, 10), 100);

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ timestamp: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Event.countDocuments(filter),
    ]);

    res.json({
      events,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
