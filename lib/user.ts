import { connectDB } from './db';
import { User } from './models/User';

export async function findUserByEmail(email: string) {
  await connectDB();
  return User.findOne({ email }).lean();
}
