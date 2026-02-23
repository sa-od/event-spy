import { NextRequest, NextResponse } from 'next/server';

function corsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    ...(origin ? { 'Access-Control-Allow-Credentials': 'true' } : {}),
  };
}

export function corsPreflightResponse(req: NextRequest) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export function withCors(response: NextResponse, req: NextRequest) {
  const origin = req.headers.get('origin');
  Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
