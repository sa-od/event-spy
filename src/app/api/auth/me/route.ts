import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = verifyAuth(req);
    await dbConnect();

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ id: user._id, email: user.email, name: user.name });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
