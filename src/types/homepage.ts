export type HeroMovie = {
  id: string;
  title: string;
  description: string;
  genres: string[];
  imageUrl: string;
};

export type MovieCardItem = {
  id: string;
  title: string;
  durationMinutes: number;
  genreLabel: string;
  coverImageUrl: string;
};

export type VenueCardItem = {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
