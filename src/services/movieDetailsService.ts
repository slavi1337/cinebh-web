import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import api from "@/services/api";
import { appendArrayParams } from "@/utils/api";
import type {
  MovieDetails,
  MovieProjection,
  MovieProjectionParams,
} from "@/types/movieDetails";

export async function getMovieDetails(movieId: string): Promise<MovieDetails> {
  const response = await api.get<MovieDetails>(
    API_ENDPOINTS.movies.details(movieId),
  );
  return response.data;
}

export async function getMovieProjections(
  movieId: string,
  params: MovieProjectionParams,
): Promise<MovieProjection[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("date", params.date);
  appendArrayParams(searchParams, "cityIds", params.cityIds);
  appendArrayParams(searchParams, "venueIds", params.venueIds);
  const queryString = searchParams.toString();
  const suffix = queryString ? `?${queryString}` : "";
  const response = await api.get<MovieProjection[]>(
    `${API_ENDPOINTS.movies.projections(movieId)}${suffix}`,
  );
  return response.data;
}
