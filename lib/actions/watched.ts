export const toggleWatched = async (movieId: string, movieName: string) => {
  const res = await fetch('/api/movie/watched', {
    method: 'POST',
    body: JSON.stringify({ movieId, movieName }),
  });
  return res.json();
};

export const getWatched = async (movieId: string) => {
  const res = await fetch(`/api/movie/watched?movieId=${movieId}`);
  return res.json();
};
