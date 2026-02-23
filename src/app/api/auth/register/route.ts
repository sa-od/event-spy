import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { validateRegister } from '@/lib/validate';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const error = validateRegister(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    await dbConnect();

    const { email, password, name } = body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), passwordHash, name });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    return NextResponse.json(
      { token, user: { id: user._id, email: user.email, name: user.name } },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
