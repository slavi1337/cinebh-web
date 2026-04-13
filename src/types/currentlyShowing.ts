export type FilterOption = {
  id: string;
  label: string;
};

export type CurrentlyShowingFiltersResponse = {
  cities: FilterOption[];
  venues: FilterOption[];
  genres: FilterOption[];
};

export type ProjectionTime = {
  projectionId: string;
  startTime: string;
  venueId: string;
  venueName: string;
  cityId: string;
  cityName: string;
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

export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CurrentlyShowingQueryParams = {
  query: string;
  cityIds: string[];
  venueIds: string[];
  genreIds: string[];
  date: string;
  projectionTimes: string[];
  page: number;
  size: number;
};
