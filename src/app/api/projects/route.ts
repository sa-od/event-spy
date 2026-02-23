import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import Event from '@/models/Event';
import { verifyAuth } from '@/lib/auth';
import { validateProject } from '@/lib/validate';
import { generateApiKey } from '@/utils/generateApiKey';

export async function GET(req: NextRequest) {
  try {
    const userId = verifyAuth(req);
    await dbConnect();

    const projects = await Project.find({ userId }).sort({ createdAt: -1 });

    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const eventCount = await Event.countDocuments({ projectId: project._id });
        return { ...project.toObject(), eventCount };
      }),
    );

    return NextResponse.json(projectsWithCounts);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = verifyAuth(req);

    const body = await req.json();
    const error = validateProject(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    await dbConnect();

    const { name, domain } = body;
    const apiKey = generateApiKey();

    const project = await Project.create({ name, domain, apiKey, userId });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
