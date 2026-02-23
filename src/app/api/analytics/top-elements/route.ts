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

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
