import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import Event from '@/models/Event';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = verifyAuth(req);
    await dbConnect();

    const { id } = await params;
    const project = await Project.findOne({ _id: id, userId });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = verifyAuth(req);
    await dbConnect();

    const { id } = await params;
    const project = await Project.findOneAndDelete({ _id: id, userId });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await Event.deleteMany({ projectId: project._id });

    return NextResponse.json({ message: 'Project deleted' });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
