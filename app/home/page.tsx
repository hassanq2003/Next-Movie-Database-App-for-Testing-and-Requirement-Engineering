'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Movie, Genre } from '@/types/tmdb';
import { getMovies, getGenres } from '@/lib/tmdb';
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { requireAuth } from '@/lib/auth';


const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function HomePage() {

  


  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenresState] = useState<Genre[]>([]);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'popular' | 'top_rated' | 'upcoming'>('popular');
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<number | ''>('');

  // Fetch genres once
  useEffect(() => {
    getGenres().then((data) => setGenresState(data.genres));
  }, []);

  // Fetch movies by tab
  useEffect(() => {
    if (selectedGenre) return; // Do not fetch tab movies if browsing by genre
    setLoading(true);
    getMovies(`/movie/${activeTab}`)
      .then((data) => setMovies(data.results.slice(0, 68)))
      .finally(() => setLoading(false));
  }, [activeTab, selectedGenre]);

  // Fetch movies by genre
  useEffect(() => {
    if (!selectedGenre) return;

    const fetchByGenre = async () => {
      setLoading(true);
      const data = await getMovies(`/discover/movie?with_genres=${selectedGenre}`);
      setMovies(data.results);
      setLoading(false);
    };

    fetchByGenre();
  }, [selectedGenre]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const data = await getMovies(`/search/movie?query=${encodeURIComponent(query)}`);
    setMovies(data.results);
    setLoading(false);
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedGenre('');
    setActiveTab('popular');
  };

  

  return (
    <div className="relative min-h-screen bg-black flex flex-col">
      {/* Background */}
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
      <div className="fixed inset-0 bg-black/50 pointer-events-none" />

      <main className="relative z-10 min-h-screen text-white p-6 flex-1">
        {/* Header */}
        <div className="flex flex-wrap items-center mb-6 gap-2">
          <h1 className="text-4xl font-bold text-yellow-400 mb-6">IMDB Clone 🎬</h1>
          <div className="ml-auto flex gap-2 flex-wrap">
            <Link href="/watched">
              <button className="text-lg bg-yellow-400 text-black w-26 h-10 rounded-lg font-semibold hover:bg-yellow-500 transition">
                Watched
              </button>
            </Link>
            <Link href="/wishlist">
              <button className="text-lg bg-yellow-400 text-black w-26 h-10 rounded-lg font-semibold hover:bg-yellow-500 transition">
                WishList
              </button>
            </Link>
            <button
              onClick={resetFilters}
              className="text-lg bg-gray-700 text-white px-4 h-10 rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {(['popular', 'top_rated', 'upcoming'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedGenre(''); }}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === tab && !selectedGenre
                  ? 'bg-yellow-400 text-black'
                  : 'border border-gray-400'
              }`}
            >
              {tab.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search + Genre Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-yellow-400 flex-1 p-2 rounded-lg text-black"
              placeholder="Search movies..."
            />
            <button className="bg-yellow-400 px-4 rounded-lg font-semibold">Search</button>
          </form>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(Number(e.target.value) || '')}
            className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-gray-300 min-w-[200px]"
          >
            <option value="">Browse by Category</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Loading / Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-gray-800 animate-pulse h-[360px] rounded-xl" />
            ))}
          </div>
        )}

        {/* Movies Grid */}
        {!loading && movies.length === 0 && <p className="text-gray-400">No movies found.</p>}

        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className="relative bg-gray-900/80 backdrop-blur-sm p-3 rounded-xl hover:scale-105 transition group">
                  <img
                    src={`${IMAGE_BASE}${movie.poster_path}`}
                    alt={movie.title}
                    className="rounded-lg h-[300px] w-full object-cover"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-center p-2 rounded-lg">
                    <p className="text-sm font-semibold">{movie.release_date?.split('-')[0] || 'N/A'}</p>
                    <p className="text-sm font-semibold">⭐ {movie.vote_average || 'N/A'}</p>
                    {movie.genre_ids?.length && (
                      <p className="text-xs mt-1">
                        {movie.genre_ids
                          .map((id) => genres.find((g) => g.id === id)?.name)
                          .filter(Boolean)
                          .join(', ')
                        }
                      </p>
                    )}
                  </div>
                  <h2 className="mt-2 text-sm font-semibold text-center">{movie.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm text-center py-4 mt-auto border-t border-gray-700">
        Made with Next.js, React & TailwindCSS
      </footer>
    </div>
  );
}
