import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import moviePosterPlaceholder from "@/assets/movie-poster-placeholder.svg";
import { getMovieDetailsPath } from "@/constants/routes";
import LeftArrowIcon from "@/components/ui/icons/LeftArrowIcon";
import RightArrowIcon from "@/components/ui/icons/RightArrowIcon";
import type { MovieCardItem } from "@/types/homepage";
type MovieSeeAlsoSectionProps = {
  movies: MovieCardItem[];
  isUpcoming: boolean;
};
const PAGE_SIZE = 6;
export default function MovieSeeAlsoSection({
  movies,
  isUpcoming,
}: MovieSeeAlsoSectionProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(movies.length / PAGE_SIZE);
  const canGoBack = page > 0;
  const canGoForward = page + 1 < totalPages;
  const visibleMovies = useMemo(() => {
    const start = page * PAGE_SIZE;
    return movies.slice(start, start + PAGE_SIZE);
  }, [movies, page]);
  const startItem = movies.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const endItem = Math.min((page + 1) * PAGE_SIZE, movies.length);
  return (
    <section className="mt-20">
      <h2 className="text-[24px] leading-8 font-bold tracking-[-0.0015em] text-movie-details-heading">
        See Also {isUpcoming ? "(Upcoming Movies)" : "(Currently Showing)"}
      </h2>
      {movies.length ? (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {visibleMovies.map((movie) => (
              <Link
                key={movie.id}
                to={getMovieDetailsPath(movie.id)}
                className="flex h-50 cursor-pointer flex-col rounded-lg border border-movie-details-border bg-movie-details-card-background p-3 shadow-movie-card transition-transform hover:-translate-y-0.5"
              >
                <img
                  src={movie.coverImageUrl ?? moviePosterPlaceholder}
                  alt={movie.title}
                  className="h-34 w-full rounded-xl object-cover"
                />
                <h3 className="mt-3 truncate text-body-md font-semibold text-movie-details-heading">
                  {movie.title}
                </h3>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-end gap-4">
              <span className="text-body-md text-pagination-text">
                Showing{" "}
                <span className="font-semibold">
                  {startItem}-{endItem}
                </span>{" "}
                out of <span className="font-semibold">{movies.length}</span>
              </span>
              <button
                type="button"
                disabled={!canGoBack}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-pagination-button-border bg-pagination-button-background text-pagination-button-icon transition-colors enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-pagination-button-icon-disabled"
              >
                <LeftArrowIcon />
              </button>
              <button
                type="button"
                disabled={!canGoForward}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-pagination-button-border bg-pagination-button-background text-pagination-button-icon transition-colors enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-pagination-button-icon-disabled"
              >
                <RightArrowIcon />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-3xl border border-movie-details-border bg-white p-8 text-body-md text-page-muted">
          No related movies available.
        </div>
      )}
    </section>
  );
}
