'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MovieDetails, Review } from '@/types/tmdb';
import { getMovieDetails, getMovieReviews } from '@/lib/tmdb';
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

import { toggleWatched, getWatched } from '@/lib/actions/watched';
import { toggleWishlist, getWishlist } from '@/lib/actions/wishlist';
import { saveReview, getReview } from '@/lib/actions/review';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = React.useState<MovieDetails | null>(null);
  const [reviews, setReviews] = React.useState<Review[]>([]);

  const [watched, setWatched] = React.useState(false);
  const [wishlist, setWishlist] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');
  const [userFeedbacks, setUserFeedbacks] = React.useState<{ rating: number; text: string }[]>([]);

  React.useEffect(() => {
    if (!id) return;

    getMovieDetails(id as string).then(setMovie);
    getMovieReviews(id as string).then((r) => setReviews(r.results));

    getWatched(id as string).then(r => setWatched(r.watched));
    getWishlist(id as string).then(r => setWishlist(r.wishlist));

    getReview(id as string).then((r) => {
      if (r) {
        setRating(r.rating);
        setUserFeedbacks([{ rating: r.rating, text: r.text }]);
      }
    });
  }, [id]);

  const handleWatched = async () => {
    if (!movie) return;
    const res = await toggleWatched(id as string, movie.title);
    setWatched(res.watched);
  };

  const handleWishlist = async () => {
    if (!movie) return;
    const res = await toggleWishlist(id as string, movie.title);
    setWishlist(res.wishlist);
  };

  const handleSubmitFeedback = async () => {
    if (!rating) return;

    const saved = await saveReview(id as string, rating, feedback);
    setUserFeedbacks([{ rating: saved.rating, text: saved.text }]);
    setFeedback('');
  };


  if (!movie) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <DottedGlowBackground
        className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-40"
        opacity={10}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
      <p className="text-white text-xl relative z-10">Loading...</p>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black">
      {/* Dotted Glow Background */}
      <DottedGlowBackground
  className="fixed inset-0 pointer-events-none opacity-100" // Increased opacity
  opacity={0.4} // Increased from 1 to 5
  gap={38} // Decreased gap (more dots, closer together)
  radius={2.5} // Increased radius (bigger dots)
  colorLightVar="--color-neutral-400"
  glowColorLightVar="--color-neutral-500"
  colorDarkVar="--color-neutral-300" // Lighter color
  glowColorDarkVar="--color-blue-500" // Brighter glow color
  backgroundOpacity={0}
  speedMin={0.2}
  speedMax={1.2}
  speedScale={0.8}
/>
      
      {/* Semi-transparent overlay to enhance text readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 pointer-events-none" />
      
      {/* Content */}
      <main className="relative z-10 text-white p-4 md:p-6">
        {/* Header with top buttons */}
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
  <Link href="/home">
    <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 hover:text-yellow-300 transition cursor-pointer">
      IMDB Clone 🎬
    </h1>
  </Link>

  <div className="flex gap-3">
    <Link href="/watched">
      <button className="px-4 py-2 bg-yellow-400/90 text-black rounded-lg font-semibold hover:bg-yellow-500 transition text-sm md:text-base backdrop-blur-sm">
        Watched
      </button>
    </Link>

    <Link href="/wishlist">
      <button className="px-4 py-2 bg-yellow-400/90 text-black rounded-lg font-semibold hover:bg-yellow-500 transition text-sm md:text-base backdrop-blur-sm">
        WishList
      </button>
    </Link>
  </div>
</div>


        {/* Movie info */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="flex justify-center lg:justify-start">
              <img
                src={`${IMAGE_BASE}${movie.poster_path}`}
                alt={movie.title}
                className="rounded-xl w-full max-w-md h-auto object-cover shadow-2xl"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-3">{movie.title}</h2>
                <div className="flex flex-wrap items-center gap-2 text-gray-300 mb-4">
                  <span>{movie.release_date}</span>
                  <span>•</span>
                  <span>{movie.runtime} min</span>
                  {movie.genres && movie.genres.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.map((g) => (
                          <span key={g.id} className="px-3 py-1 bg-black/40 rounded-full text-sm backdrop-blur-sm">
                            {g.name}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <p className="text-gray-100 text-lg leading-relaxed">{movie.overview}</p>
              </div>

              {/* Buttons below description */}
              <div className="flex flex-wrap gap-4 pt-6">
                <button
                  onClick={handleWatched}
                  className={`px-6 py-3 rounded-lg font-semibold transition backdrop-blur-sm ${
                    watched ? 'bg-green-500/90 text-black' : 'bg-yellow-400/90 text-black hover:bg-yellow-500'
                  }`}
                >
                  {watched ? '✓ Watched' : 'Add to Watched'}
                </button>

                <button
                  onClick={handleWishlist}
                  className={`px-6 py-3 rounded-lg font-semibold transition backdrop-blur-sm ${
                    wishlist ? 'bg-blue-500/90 text-black' : 'bg-yellow-400/90 text-black hover:bg-yellow-500'
                  }`}
                >
                  {wishlist ? '★ In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Rating & Feedback */}
              {watched && (
                <div className="pt-8 border-t border-gray-600/50">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Rate & Feedback</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`text-3xl transition-transform hover:scale-110 ${
                          s <= rating ? 'text-yellow-400' : 'text-gray-400'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="w-full p-4 rounded-lg bg-black/40 text-white border border-gray-600/50 focus:border-yellow-400 focus:outline-none backdrop-blur-sm"
                    placeholder="Write your feedback..."
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!rating}
                    className="mt-4 bg-yellow-400/90 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User feedbacks */}
          {userFeedbacks.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">Your Feedbacks</h3>
              <div className="space-y-4">
                {userFeedbacks.map((f, i) => (
                  <div key={i} className="bg-black/40 p-6 rounded-xl border border-gray-600/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`text-xl ${s <= f.rating ? 'text-yellow-400' : 'text-gray-400'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-100">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TMDB Reviews */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6">Other Reviews</h3>
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((r) => (
                  <div key={r.id} className="bg-black/40 p-6 rounded-xl border border-gray-600/50 backdrop-blur-sm">
                    <p className="font-semibold text-lg text-yellow-300 mb-2">{r.author}</p>
                    <p className="text-gray-100 line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                      {r.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No reviews available for this movie.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}