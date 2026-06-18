import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import moviePosterPlaceholder from "@/assets/movie-poster-placeholder.svg";
import GroupedShowtimes from "@/components/showtimes/GroupedShowtimes";
import type { CurrentlyShowingMovie } from "@/types/currentlyShowing";
import { formatDuration, formatEndDate } from "@/utils/currentlyShowing";
import { formatVenueLabel, formatVenueSummary } from "@/utils/venues";
type CurrentlyShowingCardProps = {
  movie: CurrentlyShowingMovie;
};
export default function CurrentlyShowingCard({
  movie,
}: CurrentlyShowingCardProps) {
  const navigate = useNavigate();
  const venueSummary = useMemo(() => {
    const venues = Array.from(
      new Set(
        movie.showtimes.map((showtime) =>
          formatVenueLabel(showtime.venueName, showtime.cityName),
        ),
      ),
    );
    return formatVenueSummary(venues);
  }, [movie.showtimes]);
  const metaItems = [
    movie.pgRating,
    movie.language,
    formatDuration(movie.durationMinutes),
  ].filter(Boolean);

  function handleShowtimeClick(projectionId: string) {
    navigate(
      `/movies/${movie.movieId}/seats?projectionId=${projectionId}&mode=buy`,
    );
  }

  return (
    <article className="rounded-3xl border border-border-default bg-white p-4 shadow-movie-card md:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-4">
        <Link to={`/movies/${movie.movieId}`} className="shrink-0">
          <img
            src={movie.posterImageUrl || moviePosterPlaceholder}
            alt={movie.title}
            className="h-71.75 w-full cursor-pointer rounded-2xl object-cover transition-transform hover:scale-[1.02] md:w-67.5"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 lg:min-h-71.75">
          <div>
            <Link to={`/movies/${movie.movieId}`}>
              <h2 className="cursor-pointer text-[32px] leading-10 font-bold tracking-[-0.0025em] text-page-heading hover:text-brand-red">
                {movie.title}
              </h2>
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-y-2 text-body-md text-page-heading">
              {metaItems.map((item, index) => (
                <div key={item} className="flex items-center">
                  {index > 0 && <span className="mx-3 h-5 w-px bg-brand-red" />}
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex h-8 items-center rounded-lg bg-border-default px-2 text-[14px] leading-5 tracking-[0.0025em] text-icon-default"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[13px] leading-5 tracking-[0.0015em] text-page-muted">
              Available in:{" "}
              <span className="font-semibold text-page-heading">
                {venueSummary}
              </span>
            </p>
            <p className="text-[14px] leading-5 tracking-[0.0025em] italic text-page-muted">
              {formatEndDate(movie.endDate)}
            </p>
          </div>
        </div>
        <div className="w-full lg:w-105 lg:shrink-0">
          <p className="text-[20px] leading-6 font-bold tracking-[-0.0015em] text-brand-red">
            Showtimes
          </p>
          <div className="mt-4">
            <GroupedShowtimes
              showtimes={movie.showtimes}
              emptyLabel="No projection times available for selected filters."
              maxHeightClassName="max-h-62"
              onShowtimeClick={(showtime) =>
                handleShowtimeClick(showtime.projectionId)
              }
            />
          </div>
        </div>
      </div>
    </article>
  );
}
