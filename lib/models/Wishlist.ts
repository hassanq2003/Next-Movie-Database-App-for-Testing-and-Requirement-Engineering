import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema(
  {
    movieId: String,
    movieName: String,
  },
  { timestamps: true }
);

export default mongoose.models.Wishlist ||
  mongoose.model('Wishlist', WishlistSchema);
