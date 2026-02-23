import { NextRequest } from 'next/server';
import dbConnect from './dbConnect';
import Project, { IProject } from '@/models/Project';

export async function verifyApiKey(req: NextRequest): Promise<IProject> {
  const apiKey = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('key');

  if (!apiKey) {
    throw new Error('API key required');
  }

  await dbConnect();
  const project = await Project.findOne({ apiKey });
  if (!project) {
    throw new Error('Invalid API key');
  }

  return project;
}
