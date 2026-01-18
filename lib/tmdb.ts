// src/lib/tmdb.ts

import { Movie, MovieDetails, Review, Genre, TMDBResponse } from '@/types/tmdb';

const TMDB_BASE = 'https://api.themoviedb.org/3';

const headers = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
  Accept: 'application/json',
};

// 🔹 Generic fetch helper
async function tmdbFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${TMDB_BASE}${endpoint}`, { headers });
  if (!res.ok) throw new Error('TMDB API error');
  return res.json();
}

// 🔹 Movies
export const getMovies = (endpoint: string) =>
  tmdbFetch<TMDBResponse<Movie>>(endpoint);

// 🔹 Movie details
export const getMovieDetails = (id: string) =>
  tmdbFetch<MovieDetails>(`/movie/${id}`);

// 🔹 Movie reviews
export const getMovieReviews = (id: string) =>
  tmdbFetch<TMDBResponse<Review>>(`/movie/${id}/reviews`);

// 🔹 Genres
export const getGenres = () =>
  tmdbFetch<{ genres: Genre[] }>('/genre/movie/list');
