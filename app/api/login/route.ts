import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User does not exist' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Incorrect password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const res = NextResponse.json({ success: true });
    // Set HTTP-only cookie
    res.cookies.set('token', token, { httpOnly: true, path: '/' });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Login failed' }, { status: 500 });
  }
}
