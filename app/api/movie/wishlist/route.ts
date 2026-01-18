import { connectDB } from '@/lib/db';
import Wishlist from '@/lib/models/Wishlist';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { movieId, movieName } = await req.json();
  await connectDB();

  const exists = await Wishlist.findOne({ movieId });

  if (exists) {
    await Wishlist.deleteOne({ movieId });
    return NextResponse.json({ wishlist: false });
  }

  await Wishlist.create({ movieId, movieName });
  return NextResponse.json({ wishlist: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get('movieId');

  await connectDB();
  const exists = await Wishlist.exists({ movieId });

  return NextResponse.json({ wishlist: !!exists });
}
