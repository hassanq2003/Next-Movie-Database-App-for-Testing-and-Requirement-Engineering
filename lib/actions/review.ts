export const saveReview = async (
  movieId: string,
  rating: number,
  text: string
) => {
  const res = await fetch('/api/movie/review', {
    method: 'POST',
    body: JSON.stringify({ movieId, rating, text }),
  });
  return res.json();
};

export const getReview = async (movieId: string) => {
  const res = await fetch(`/api/movie/review?movieId=${movieId}`);
  return res.json();
};
