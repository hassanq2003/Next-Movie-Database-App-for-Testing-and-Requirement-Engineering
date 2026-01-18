import { connectDB } from '@/lib/db';
import Review from '@/lib/models/Review';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { movieId, rating, text } = await req.json();
  await connectDB();

  const review = await Review.findOneAndUpdate(
    { movieId },
    { rating, text },
    { upsert: true, new: true }
  );

  return NextResponse.json(review);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get('movieId');

  await connectDB();
  const review = await Review.findOne({ movieId });

  return NextResponse.json(review);
}
