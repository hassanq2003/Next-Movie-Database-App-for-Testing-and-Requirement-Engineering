// src/types/tmdb.ts

export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;   // Add this
  genre_ids?: number[];    // Add this
};


export type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: Genre[];
};

export type Review = {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    rating: number | null;
  };
};

export type Genre = {
  id: number;
  name: string;
};

export type TMDBResponse<T> = {
  results: T[];
};
