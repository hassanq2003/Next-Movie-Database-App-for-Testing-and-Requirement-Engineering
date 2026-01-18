type MovieFromDB = {
  _id: string;
  movieId: string;
  movieName: string;
  createdAt: string;
};

type MovieFull = MovieFromDB & {
  posterPath?: string;
  releaseDate?: string;
  runtime?: number;
  genres?: string[];
};