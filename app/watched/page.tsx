'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { getMovieDetails } from '@/lib/tmdb';
import { MovieFromDB, MovieFull } from '@/lib/models/Watched&&WishlistPage';
import { sortMovies, SortKey, SortOrder } from '@/lib/sort/movies';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w200';

export default function WatchedPage() {
  const [allMovies, setAllMovies] = React.useState<MovieFull[]>([]);
  const [movies, setMovies] = React.useState<MovieFull[]>([]);
  const [sortKey, setSortKey] = React.useState<SortKey | ''>('');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');

  const router = useRouter();

  // FETCH + TMDB DETAILS
  React.useEffect(() => {
    async function fetchMovies() {
      const res = await fetch('/api/movie/watched/list');
      const data: MovieFromDB[] = await res.json();

      const moviesWithDetails: MovieFull[] = await Promise.all(
        data.map(async (m) => {
          try {
            const details = await getMovieDetails(m.movieId);
            return {
              ...m,
              posterPath: details.poster_path,
              releaseDate: details.release_date,
              runtime: details.runtime,
              genres: details.genres?.map((g) => g.name) || [],
            };
          } catch {
            return m;
          }
        })
      );

      setAllMovies(moviesWithDetails);
      setMovies(moviesWithDetails);
    }

    fetchMovies();
  }, []);

  // SORT (REUSABLE)
  React.useEffect(() => {
    if (!sortKey) {
      setMovies(allMovies);
      return;
    }

    setMovies(sortMovies(allMovies, sortKey, sortOrder));
  }, [sortKey, sortOrder, allMovies]);

  return (
    <div className="relative min-h-screen bg-black text-white">
      <DottedGlowBackground
        className="fixed inset-0 pointer-events-none opacity-100"
        opacity={0.4}
        gap={38}
        radius={2.5}
        colorLightVar="--color-neutral-400"
        glowColorLightVar="--color-neutral-500"
        colorDarkVar="--color-neutral-300"
        glowColorDarkVar="--color-blue-500"
        backgroundOpacity={0}
        speedMin={0.2}
        speedMax={1.2}
        speedScale={0.8}
      />

      <div className="relative z-10 p-6">
        <Link href="/home" className="text-yellow-400 font-bold text-xl hover:underline">
          ← Back
        </Link>

        <h1 className="text-3xl font-bold text-yellow-400 mt-6 mb-6">
          Watched Movies
        </h1>

        {/* SORT CONTROLS */}
        <div className="flex gap-4 mb-4">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-gray-300"
          >
            <option value="">Sort by</option>
            <option value="movieName">Movie</option>
            <option value="releaseDate">Release</option>
            <option value="runtime">Runtime</option>
            <option value="createdAt">Added</option>
          </select>

          {sortKey && (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-gray-300"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          )}
        </div>

        {movies.length === 0 ? (
          <p className="text-gray-400">No watched movies found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-700 bg-black/40 backdrop-blur-sm">
            <table className="w-full border-collapse">
              <thead className="bg-gray-900/80 text-gray-300">
                <tr>
                  <th className="text-left px-6 py-3">Poster</th>
                  <th className="text-left px-6 py-3">Movie</th>
                  <th className="text-left px-6 py-3">Release</th>
                  <th className="text-left px-6 py-3">Runtime</th>
                  <th className="text-left px-6 py-3">Genres</th>
                  <th className="text-left px-6 py-3">Added</th>
                </tr>
              </thead>

              <tbody>
                {movies.map((movie) => (
                  <tr
                    key={movie._id}
                    onClick={() => router.push(`/movie/${movie.movieId}`)}
                    className="cursor-pointer border-t border-gray-800 hover:bg-gray-900/60 transition"
                  >
                    <td className="px-4 py-2">
                      {movie.posterPath ? (
                        <img
                          src={`${IMAGE_BASE}${movie.posterPath}`}
                          alt={movie.movieName}
                          className="w-16 h-24 object-cover rounded-lg shadow-md"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-gray-800 flex items-center justify-center rounded-lg text-gray-500 text-sm">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-yellow-300 font-medium">
                      {movie.movieName}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {movie.releaseDate || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {movie.runtime ? `${movie.runtime} min` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {movie.genres?.join(', ') || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(movie.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
