import moviePosterPlaceholder from "@/assets/movie-poster-placeholder.svg";
import type { UpcomingMovie } from "@/types/upcomingMovies";
import {
  formatOpeningLabel,
  formatUpcomingDuration,
  formatUpcomingGenres,
} from "@/utils/upcomingMovies";

type UpcomingMovieCardProps = {
  movie: UpcomingMovie;
};

export default function UpcomingMovieCard({ movie }: UpcomingMovieCardProps) {
  const durationLabel = formatUpcomingDuration(movie.durationMinutes);
  const genresLabel = formatUpcomingGenres(movie.genres);

  return (
    <article className="w-full cursor-pointer rounded-3xl border border-border-default bg-white p-4 shadow-movie-card transition-transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={movie.posterImageUrl || moviePosterPlaceholder}
          alt={movie.title}
          className="h-71.75 w-full rounded-2xl object-cover"
        />

        <div className="absolute top-4 right-0 rounded-tl-lg rounded-tr-lg rounded-bl-lg bg-brand-red px-3 py-2">
          <span className="text-[14px] leading-5 tracking-[0.0025em] font-semibold text-white">
            {formatOpeningLabel(movie.openingDate)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-[20px] leading-6 tracking-[-0.0015em] font-bold text-page-heading">
          {movie.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] leading-5 tracking-[0.0025em] text-page-muted">
          {durationLabel ? <span>{durationLabel}</span> : null}
          {durationLabel && genresLabel ? (
            <span className="h-4 w-px bg-[#98A2B3]" />
          ) : null}
          {genresLabel ? <span>{genresLabel}</span> : null}
        </div>
      </div>
    </article>
  );
}
