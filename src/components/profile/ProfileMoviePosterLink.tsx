import { Link } from "react-router-dom";
import moviePosterPlaceholder from "@/assets/movie-poster-placeholder.svg";

type ProfileMoviePosterLinkProps = {
  movieId: string;
  movieTitle: string;
  posterImageUrl: string | null;
};

export default function ProfileMoviePosterLink({
  movieId,
  movieTitle,
  posterImageUrl,
}: ProfileMoviePosterLinkProps) {
  return (
    <Link
      to={`/movies/${movieId}`}
      className="block h-28 w-28 overflow-hidden rounded-2xl bg-movie-details-chip-background"
    >
      <img
        src={posterImageUrl || moviePosterPlaceholder}
        alt={movieTitle}
        className="h-full w-full object-cover"
      />
    </Link>
  );
}
