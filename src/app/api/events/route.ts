import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';
import Project from '@/models/Project';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = verifyAuth(req);
    await dbConnect();

    const { searchParams } = req.nextUrl;
    const projectId = searchParams.get('projectId');
    const eventType = searchParams.get('eventType');
    const pageUrl = searchParams.get('pageUrl');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const filter: Record<string, unknown> = { projectId };

    if (eventType) filter.eventType = eventType;
    if (pageUrl) filter.pageUrl = { $regex: pageUrl, $options: 'i' };
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) (filter.timestamp as Record<string, unknown>).$gte = new Date(startDate);
      if (endDate) (filter.timestamp as Record<string, unknown>).$lte = new Date(endDate);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), 100);

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ timestamp: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Event.countDocuments(filter),
    ]);

    return NextResponse.json({
      events,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
