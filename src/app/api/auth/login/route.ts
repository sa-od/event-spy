import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { validateLogin } from '@/lib/validate';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const error = validateLogin(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    await dbConnect();

    const { email, password } = body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    return NextResponse.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
