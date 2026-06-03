import type { MovieDetails } from "@/types/movieDetails";
type UpcomingNotifyCardProps = {
  movie: MovieDetails;
  isAuthenticated: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
};
function getReleaseMonth(releaseDate: string | null) {
  if (!releaseDate) {
    return "soon";
  }
  return new Date(`${releaseDate}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
  });
}
export default function UpcomingNotifyCard({
  movie,
  isAuthenticated,
  onSignIn,
  onSignUp,
}: UpcomingNotifyCardProps) {
  return (
    <section className="rounded-3xl border border-movie-details-border bg-movie-details-card-background shadow-[0px_8px_18px_rgba(52,64,84,0.08)]">
      <div className="px-6 pt-8 pb-10 text-center">
        <h2 className="text-[24px] leading-8 font-bold tracking-[-0.0015em] text-movie-details-heading">
          {movie.title} is coming in {getReleaseMonth(movie.releaseDate)}!
        </h2>
        <p className="mt-4 text-body-md text-movie-details-muted">
          Get notified when the movie is part of the schedule
        </p>
        <div className="mt-12 flex justify-center">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-movie-details-chip-background">
            <span className="absolute -top-4 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-page-muted" />
            <span className="absolute top-1/2 -left-6 h-3 w-3 -translate-y-1/2 rounded-full bg-movie-details-border" />
            <span className="absolute top-1/2 -right-6 h-3 w-3 -translate-y-1/2 rounded-full bg-movie-details-border" />
            <span className="absolute bottom-3 left-4 h-5 w-5 rounded-full bg-navbar-background" />
            <span className="absolute right-4 bottom-3 h-5 w-5 rounded-full bg-page-muted" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-12 w-12 text-page-muted"
            >
              <path
                d="M15 17H9m9-2v-4a6 6 0 0 0-12 0v4l-2 2h16l-2-2Z"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M10 21h4" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      <div className="border-t border-movie-details-border px-6 py-6">
        <button
          type="button"
          disabled={isAuthenticated}
          onClick={onSignIn}
          className="h-12 w-full rounded-lg bg-brand-red text-body-md font-semibold text-white transition-colors enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-movie-details-border"
        >
          Notify Me
        </button>
        {!isAuthenticated && (
          <p className="mt-4 text-center text-body-md text-movie-details-heading">
            Only signed users can be notified{" "}
            <button
              type="button"
              onClick={onSignIn}
              className="cursor-pointer font-semibold underline"
            >
              Sign In
            </button>{" "}
            or{" "}
            <button
              type="button"
              onClick={onSignUp}
              className="cursor-pointer font-semibold underline"
            >
              Sign Up
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
