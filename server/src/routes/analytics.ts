import { Router, Response } from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event';
import Project from '../models/Project';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.use(authMiddleware);

function getDateRange(period: string): Date {
  const now = new Date();
  switch (period) {
    case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default: return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

router.get('/summary', async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, period = '7d' } = req.query;

    if (!projectId) {
      res.status(400).json({ error: 'projectId is required' });
      return;
    }

    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const since = getDateRange(period as string);
    const pid = new mongoose.Types.ObjectId(projectId as string);

    const [summary] = await Event.aggregate([
      { $match: { projectId: pid, timestamp: { $gte: since } } },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' },
          pageViews: {
            $sum: { $cond: [{ $eq: ['$eventType', 'pageview'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEvents: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          pageViews: 1,
        },
      },
    ]);

    const topPages = await Event.aggregate([
      { $match: { projectId: pid, timestamp: { $gte: since }, eventType: 'pageview' } },
      { $group: { _id: '$pageUrl', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, pageUrl: '$_id', count: 1 } },
    ]);

    res.json({
      totalEvents: summary?.totalEvents || 0,
      uniqueVisitors: summary?.uniqueVisitors || 0,
      pageViews: summary?.pageViews || 0,
      topPages,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/events-over-time', async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, period = '7d' } = req.query;

    if (!projectId) {
      res.status(400).json({ error: 'projectId is required' });
      return;
    }

    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const since = getDateRange(period as string);
    const pid = new mongoose.Types.ObjectId(projectId as string);

    const groupBy = period === '24h'
      ? { $dateToString: { format: '%Y-%m-%d %H:00', date: '$timestamp' } }
      : { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } };

    const data = await Event.aggregate([
      { $match: { projectId: pid, timestamp: { $gte: since } } },
      { $group: { _id: groupBy, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', count: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/top-elements', async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, period = '7d' } = req.query;

    if (!projectId) {
      res.status(400).json({ error: 'projectId is required' });
      return;
    }

    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const since = getDateRange(period as string);
    const pid = new mongoose.Types.ObjectId(projectId as string);

    const data = await Event.aggregate([
      { $match: { projectId: pid, timestamp: { $gte: since }, eventType: 'click' } },
      {
        $group: {
          _id: {
            tag: '$elementTag',
            id: '$elementId',
            text: '$elementText',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          elementTag: '$_id.tag',
          elementId: '$_id.id',
          elementText: '$_id.text',
          count: 1,
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
