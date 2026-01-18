import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/user';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    return NextResponse.json({
      exists: !!user,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
