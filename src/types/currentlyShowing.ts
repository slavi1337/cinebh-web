import type { FilterOption } from "@/types/common";

export type ProjectionTime = {
  projectionId: string;
  startTime: string;
  venueId: string;
  venueName: string;
  cityId: string;
  cityName: string;
};

export type CurrentlyShowingFiltersResponse = {
  cities: FilterOption[];
  venues: FilterOption[];
  genres: FilterOption[];
};

export type CurrentlyShowingMovie = {
  movieId: string;
  title: string;
  posterImageUrl: string | null;
  pgRating: string | null;
  language: string | null;
  durationMinutes: number | null;
  genres: string[];
  endDate: string | null;
  showtimes: ProjectionTime[];
};

export type CurrentlyShowingQueryParams = {
  query?: string;
  cityIds?: string[];
  venueIds?: string[];
  genreIds?: string[];
  date?: string;
  projectionTimes?: string[];
  page?: number;
  size?: number;
};
