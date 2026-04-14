import { useState } from "react";
import moviePosterPlaceholder from "@/assets/movie-poster-placeholder.svg";
import type { CurrentlyShowingMovie } from "@/types/currentlyShowing";
import {
  formatDuration,
  formatEndDate,
  formatTimeLabel,
} from "@/utils/currentlyShowing";

type CurrentlyShowingCardProps = {
  movie: CurrentlyShowingMovie;
};

export default function CurrentlyShowingCard({
  movie,
}: CurrentlyShowingCardProps) {
  const [selectedProjectionId, setSelectedProjectionId] = useState<
    string | null
  >(null);

  const metaItems = [
    movie.pgRating,
    movie.language,
    formatDuration(movie.durationMinutes),
  ].filter(Boolean);

  return (
    <article className="rounded-3xl border border-border-default bg-white p-4 shadow-movie-card md:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-4">
        <div className="shrink-0">
          <img
            src={movie.posterImageUrl || moviePosterPlaceholder}
            alt={movie.title}
            className="h-71.75 w-full rounded-2xl object-cover md:w-67.5"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 lg:min-h-71.75">
          <div>
            <h2 className="text-[32px] leading-10 tracking-[-0.0025em] font-bold text-page-heading">
              {movie.title}
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-y-2 text-body-md text-page-heading">
              {metaItems.map((item, index) => (
                <div key={item} className="flex items-center">
                  {index > 0 && (
                    <span
                      className="mx-3 h-5 w-px bg-brand-red"
                      aria-hidden="true"
                    />
                  )}
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

          <p className="text-[14px] leading-5 tracking-[0.0025em] italic text-page-muted">
            {formatEndDate(movie.endDate)}
          </p>
        </div>

        <div className="w-full lg:w-105 lg:shrink-0">
          <p className="text-[20px] leading-6 tracking-[-0.0015em] font-bold text-brand-red">
            Showtimes
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {movie.showtimes.map((showtime) => {
              const isSelected = selectedProjectionId === showtime.projectionId;

              return (
                <button
                  key={showtime.projectionId}
                  type="button"
                  onClick={() => setSelectedProjectionId(showtime.projectionId)}
                  className={`inline-flex h-12 min-w-17.75 cursor-pointer items-center justify-center rounded-lg border px-4 text-[20px] leading-6 tracking-[-0.0015em] font-bold transition-colors ${
                    isSelected
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-border-default bg-white text-page-heading hover:border-brand-red hover:text-brand-red"
                  }`}
                >
                  {formatTimeLabel(showtime.startTime)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
