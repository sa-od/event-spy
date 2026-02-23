import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const sdkPath = path.join(process.cwd(), 'sdk', 'dist', 'tracker.js');

  if (!fs.existsSync(sdkPath)) {
    return new NextResponse('// SDK not built yet. Run: cd sdk && npm run build', {
      status: 404,
      headers: { 'Content-Type': 'application/javascript' },
    });
  }

  const content = fs.readFileSync(sdkPath, 'utf-8');
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
