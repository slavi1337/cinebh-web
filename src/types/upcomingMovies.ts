import type { FilterOption } from "@/types/common";

export type UpcomingMoviesFiltersResponse = {
  cities: FilterOption[];
  venues: FilterOption[];
  genres: FilterOption[];
};

export type UpcomingMovie = {
  movieId: string;
  title: string;
  posterImageUrl: string | null;
  durationMinutes: number | null;
  genres: string[];
  venues: string[];
  openingDate: string;
};

export type GetUpcomingMoviesParams = {
  query?: string;
  cityIds?: string[];
  venueIds?: string[];
  genreIds?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
};
