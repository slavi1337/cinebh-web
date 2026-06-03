import type { FilterOption } from "@/types/common";
import type { MovieCardItem } from "@/types/homepage";
export type MovieCastMember = {
  name: string;
  characterName: string | null;
};
export type MovieDetails = {
  id: string;
  title: string;
  synopsis: string | null;
  pgRating: string | null;
  language: string | null;
  durationMinutes: number | null;
  imdbRating: number | null;
  rottenTomatoesRating: number | null;
  releaseDate: string | null;
  endDate: string | null;
  trailerUrl: string | null;
  coverImageUrl: string | null;
  previewImageUrls: string[];
  genres: string[];
  cast: MovieCastMember[];
  directors: string[];
  writers: string[];
  cities: FilterOption[];
  venues: FilterOption[];
  projectionDates: string[];
  seeAlso: MovieCardItem[];
};
export type MovieProjection = {
  projectionId: string;
  startTime: string;
  venueId: string;
  venueName: string;
  cityId: string;
  cityName: string;
  hallId: string;
  hallName: string;
};
export type MovieProjectionParams = {
  date: string;
  cityIds?: string[];
  venueIds?: string[];
};
