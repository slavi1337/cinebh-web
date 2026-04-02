import api from "@/services/api";
import type { HeroMovie, MovieCardItem, PageResponse } from "@/types/homepage";

export async function getHeroMovies(): Promise<HeroMovie[]> {
  const response = await api.get<HeroMovie[]>("/api/movies/hero");
  return response.data;
}

export async function getCurrentlyShowingMovies(
  page = 0,
  size = 10,
): Promise<PageResponse<MovieCardItem>> {
  const response = await api.get<PageResponse<MovieCardItem>>(
    "/api/movies/currently-showing",
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
    "/api/movies/upcoming",
    {
      params: { page, size },
    },
  );

  return response.data;
}
