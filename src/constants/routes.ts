import { generatePath } from "react-router-dom";
import type { BookingMode } from "@/types/booking";

export const ROUTE_PATHS = {
  home: "/",
  currentlyShowing: "/currently-showing",
  movieDetails: "/movies/:movieId",
  seatSelection: "/movies/:movieId/seats",
} as const;

export function getMovieDetailsPath(movieId: string) {
  return generatePath(ROUTE_PATHS.movieDetails, { movieId });
}

export function getSeatSelectionPath(
  movieId: string,
  projectionId: string,
  mode: BookingMode,
) {
  const searchParams = new URLSearchParams({ projectionId, mode });
  return `${generatePath(ROUTE_PATHS.seatSelection, { movieId })}?${searchParams}`;
}
