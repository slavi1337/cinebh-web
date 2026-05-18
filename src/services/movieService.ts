import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { PageResponse } from "@/types/common";
import type { HeroMovie, MovieCardItem } from "@/types/homepage";

export async function getHeroMovies(): Promise<HeroMovie[]> {
  const response = await api.get<HeroMovie[]>(API_ENDPOINTS.movies.hero);
  return response.data;
}

export async function getCurrentlyShowingMovies(
  page = 0,
  size = 10,
): Promise<PageResponse<MovieCardItem>> {
  const response = await api.get<PageResponse<MovieCardItem>>(
    API_ENDPOINTS.movies.currentlyShowing,
    {
      params: { page, size },
    },
  );

  return response.data;
}

export async function getUpcomingMovies(
  page = 0,
  size = 10,
): Promise<PageResponse<MovieCardItem>> {
  const response = await api.get<PageResponse<MovieCardItem>>(
    API_ENDPOINTS.movies.upcoming,
    {
      params: { page, size },
    },
  );

  return response.data;
}
