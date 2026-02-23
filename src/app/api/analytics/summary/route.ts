import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';
import Project from '@/models/Project';
import { verifyAuth } from '@/lib/auth';

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

export async function GET(req: NextRequest) {
  try {
    const userId = verifyAuth(req);
    await dbConnect();

    const { searchParams } = req.nextUrl;
    const projectId = searchParams.get('projectId');
    const period = searchParams.get('period') || '7d';

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const since = getDateRange(period);
    const pid = new mongoose.Types.ObjectId(projectId);

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

    return NextResponse.json({
      totalEvents: summary?.totalEvents || 0,
      uniqueVisitors: summary?.uniqueVisitors || 0,
      pageViews: summary?.pageViews || 0,
      topPages,
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
