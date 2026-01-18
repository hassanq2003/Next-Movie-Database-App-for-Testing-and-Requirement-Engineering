import { MovieFull } from "../models/Watched&&WishlistPage";

export type SortKey = 'movieName' | 'releaseDate' | 'runtime' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export function sortMovies(
  movies: MovieFull[],
  sortKey: SortKey,
  sortOrder: SortOrder
): MovieFull[] {
  return [...movies].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (sortKey === 'movieName' && typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (sortKey === 'runtime' && typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }

    if (
      (sortKey === 'releaseDate' || sortKey === 'createdAt') &&
      typeof aVal === 'string' &&
      typeof bVal === 'string'
    ) {
      return sortOrder === 'asc'
        ? new Date(aVal).getTime() - new Date(bVal).getTime()
        : new Date(bVal).getTime() - new Date(aVal).getTime();
    }

    return 0;
  });
}
