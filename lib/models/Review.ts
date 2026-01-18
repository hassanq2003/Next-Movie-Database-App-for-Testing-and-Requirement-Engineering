import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    movieId: String,
    rating: Number,
    text: String,
  },
  { timestamps: true }
);

export default mongoose.models.Review ||
  mongoose.model('Review', ReviewSchema);
