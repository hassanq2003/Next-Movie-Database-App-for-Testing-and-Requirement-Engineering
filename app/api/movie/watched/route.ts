import { connectDB } from '@/lib/db';
import Watched from '@/lib/models/Watched';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { movieId, movieName } = await req.json();
  await connectDB();

  const exists = await Watched.findOne({ movieId });

  if (exists) {
    await Watched.deleteOne({ movieId });
    return NextResponse.json({ watched: false });
  }

  await Watched.create({ movieId, movieName });
  return NextResponse.json({ watched: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get('movieId');

  await connectDB();
  const exists = await Watched.exists({ movieId });

  return NextResponse.json({ watched: !!exists });
}
