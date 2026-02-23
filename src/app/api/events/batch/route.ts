import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';
import { verifyApiKey } from '@/lib/apiKey';
import { validateEvents } from '@/lib/validate';
import { corsPreflightResponse, withCors } from '@/lib/cors';

export async function OPTIONS() {
  return corsPreflightResponse();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const error = validateEvents(body);
    if (error) return withCors(NextResponse.json({ error }, { status: 400 }));

    const project = await verifyApiKey(req);
    await dbConnect();

    const { events } = body;

    const docs = events.map((event: Record<string, unknown>) => ({
      ...event,
      projectId: project._id,
      timestamp: event.timestamp || new Date(),
    }));

    await Event.insertMany(docs);

    return withCors(NextResponse.json({ inserted: docs.length }, { status: 201 }));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    const status = message === 'API key required' || message === 'Invalid API key' ? 401 : 500;
    return withCors(NextResponse.json({ error: message }, { status }));
  }
}
