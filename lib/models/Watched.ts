import mongoose from 'mongoose';

const WatchedSchema = new mongoose.Schema(
  {
    movieId: String,
    movieName: String,
  },
  { timestamps: true }
);

export default mongoose.models.Watched ||
  mongoose.model('Watched', WatchedSchema);
