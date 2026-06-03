import ratingStar from "@/assets/rating-star.svg";
import type { MovieDetails } from "@/types/movieDetails";
type MovieInfoPanelProps = {
  movie: MovieDetails;
  isUpcoming: boolean;
};
function formatDate(date: string | null) {
  if (!date) {
    return null;
  }
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) {
    return date;
  }
  return `${year}/${month}/${day}`;
}
function formatProjectionDateRange(movie: MovieDetails) {
  const releaseDate = formatDate(movie.releaseDate);
  const endDate = formatDate(movie.endDate);
  if (!releaseDate && !endDate) {
    return "N/A";
  }
  if (releaseDate && endDate) {
    return `${releaseDate} - ${endDate}`;
  }
  return releaseDate ?? endDate ?? "N/A";
}
function formatDuration(durationMinutes: number | null) {
  if (!durationMinutes) {
    return "N/A";
  }
  return `${durationMinutes} min`;
}
function formatPeople(names: string[]) {
  if (!names.length) {
    return "N/A";
  }
  return names.join(", ");
}
function RatingCard({
  value,
  label,
  suffix = "",
}: {
  value: number | null;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="flex h-17 w-40 items-center gap-2 rounded-lg border border-movie-details-border bg-movie-details-card-background px-3">
      <img src={ratingStar} alt="" className="h-4 w-4 shrink-0" />
      <div>
        <div className="text-[14px] leading-5 font-semibold tracking-[0.0025em] text-movie-details-dark">
          {value === null ? "N/A" : `${value}${suffix}`}
        </div>
        <div className="text-[12px] leading-4 font-normal tracking-[0.0015em] text-movie-details-muted">
          {label}
        </div>
      </div>
    </div>
  );
}
function SectionHeading({ children }: { children: string }) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <span className="h-6 w-px bg-brand-red" />
      <h2 className="text-[20px] leading-6 font-bold tracking-[-0.0015em] text-movie-details-muted">
        {children}
      </h2>
    </div>
  );
}
export default function MovieInfoPanel({
  movie,
  isUpcoming,
}: MovieInfoPanelProps) {
  return (
    <section>
      <h1 className="text-[32px] leading-10 font-bold tracking-[-0.0025em] text-movie-details-heading">
        {movie.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-body-md text-movie-details-heading">
        <span>{movie.pgRating ?? "N/A"}</span>
        <span className="h-5 w-px bg-brand-red" />
        <span>{movie.language ?? "N/A"}</span>
        <span className="h-5 w-px bg-brand-red" />
        <span>{formatDuration(movie.durationMinutes)}</span>
        <span className="h-5 w-px bg-brand-red" />
        <span>
          {isUpcoming ? "Release date" : "Projection date"}:{" "}
          {formatProjectionDateRange(movie)}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {movie.genres.length ? (
          movie.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-lg bg-movie-details-chip-background px-2 py-1.5 text-[14px] leading-5 font-normal tracking-[0.0025em] text-icon-default"
            >
              {genre}
            </span>
          ))
        ) : (
          <span className="text-body-md text-page-muted">
            No genres listed.
          </span>
        )}
      </div>
      <p className="mt-6 max-w-170 text-body-md text-movie-details-heading">
        {movie.synopsis ?? "No description available."}
      </p>
      <div className="mt-6 space-y-4 text-body-md">
        <p>
          <span className="text-movie-details-muted">Director: </span>
          <span className="text-movie-details-heading">
            {formatPeople(movie.directors)}
          </span>
        </p>
        <p>
          <span className="text-movie-details-muted">Writers: </span>
          <span className="text-movie-details-heading">
            {formatPeople(movie.writers)}
          </span>
        </p>
      </div>
      <SectionHeading>Cast</SectionHeading>
      <div className="mt-6 grid max-w-160 grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {movie.cast.length ? (
          movie.cast.map((castMember) => (
            <div key={`${castMember.name}-${castMember.characterName}`}>
              <div className="text-[14px] leading-5 font-semibold tracking-[0.0025em] text-movie-details-dark">
                {castMember.name}
              </div>
              <div className="text-[12px] leading-4 font-normal tracking-[0.0015em] text-movie-details-muted">
                {castMember.characterName ?? "N/A"}
              </div>
            </div>
          ))
        ) : (
          <p className="text-body-md text-page-muted">No cast listed.</p>
        )}
      </div>
      <SectionHeading>Rating</SectionHeading>
      <div className="mt-6 flex flex-wrap gap-4">
        <RatingCard value={movie.imdbRating} label="IMDB Rating" />
        <RatingCard
          value={movie.rottenTomatoesRating}
          label="Rotten Tomatoes"
          suffix="%"
        />
      </div>
    </section>
  );
}
