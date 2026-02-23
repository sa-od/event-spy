import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';
import { verifyApiKey } from '@/lib/apiKey';
import { validateEvents } from '@/lib/validate';
import { corsPreflightResponse, withCors } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req);
}

export async function POST(req: NextRequest) {
  console.log('\n[batch] POST /api/events/batch hit');

  try {
    // sendBeacon sends a Blob body that may not parse with req.json().
    // Fall back to reading raw text and parsing manually.
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      const text = await req.text();
      body = JSON.parse(text);
    }

    const error = validateEvents(body);
    if (error) return withCors(NextResponse.json({ error }, { status: 400 }), req);

    const project = await verifyApiKey(req);
    await dbConnect();

    const { events } = body;

    const docs = (events as Record<string, unknown>[]).map((event: Record<string, unknown>) => ({
      ...event,
      projectId: project._id,
      timestamp: event.timestamp || new Date(),
    }));

    await Event.insertMany(docs);

    // Log received events to terminal
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Received ${docs.length} event(s) from project "${project.name}" (${project.domain})`);
    for (const doc of docs as Record<string, unknown>[]) {
      const tag = doc.elementTag ? ` <${doc.elementTag}>` : '';
      const text = doc.elementText ? ` "${String(doc.elementText).slice(0, 40)}"` : '';
      const page = doc.pageUrl || '';
      console.log(`  -> ${doc.eventType}${tag}${text}  ${page}`);
    }

    return withCors(NextResponse.json({ inserted: docs.length }, { status: 201 }), req);
  } catch (err) {
    console.error('[batch] Error processing events:', err);
    const message = err instanceof Error ? err.message : 'Server error';
    const status = message === 'API key required' || message === 'Invalid API key' ? 401 : 500;
    return withCors(NextResponse.json({ error: message }, { status }), req);
  }
}
