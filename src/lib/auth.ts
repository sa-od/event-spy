import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function verifyAuth(req: NextRequest): string {
  const header = req.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  return decoded.userId;
}
