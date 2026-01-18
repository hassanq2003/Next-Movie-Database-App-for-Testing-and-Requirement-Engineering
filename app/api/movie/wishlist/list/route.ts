import { connectDB } from '@/lib/db';
import Wishlist from '@/lib/models/Wishlist';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const movies = await Wishlist.find().sort({ createdAt: -1 });
  return NextResponse.json(movies);
}
