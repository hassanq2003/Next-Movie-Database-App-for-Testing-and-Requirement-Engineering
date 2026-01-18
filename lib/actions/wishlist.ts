export const toggleWishlist = async (movieId: string, movieName: string) => {
  const res = await fetch('/api/movie/wishlist', {
    method: 'POST',
    body: JSON.stringify({ movieId, movieName }),
  });
  return res.json();
};

export const getWishlist = async (movieId: string) => {
  const res = await fetch(`/api/movie/wishlist?movieId=${movieId}`);
  return res.json();
};
