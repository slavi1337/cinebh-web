import { describe, expect, it } from "vitest";
import {
  getMovieDetailsPath,
  getSeatSelectionPath,
  ROUTE_PATHS,
} from "@/constants/routes";

describe("route paths", () => {
  it("builds a movie details path", () => {
    expect(getMovieDetailsPath("movie-id")).toBe("/movies/movie-id");
  });

  it("builds a seat selection path with its booking context", () => {
    expect(getSeatSelectionPath("movie-id", "projection-id", "reserve")).toBe(
      "/movies/movie-id/seats?projectionId=projection-id&mode=reserve",
    );
  });

  it("keeps route patterns available to the router", () => {
    expect(ROUTE_PATHS.movieDetails).toBe("/movies/:movieId");
    expect(ROUTE_PATHS.seatSelection).toBe("/movies/:movieId/seats");
  });
});
