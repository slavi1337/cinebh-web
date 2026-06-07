import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { appendArrayParams } from "@/utils/api";
import type { FilterOption, PageResponse } from "@/types/common";
import type {
  GetUpcomingMoviesParams,
  UpcomingMovie,
  UpcomingMoviesFiltersResponse,
} from "@/types/upcomingMovies";

export async function getUpcomingMovies(
  params: GetUpcomingMoviesParams,
): Promise<PageResponse<UpcomingMovie>> {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set("query", params.query);
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  appendArrayParams(searchParams, "cityIds", params.cityIds);
  appendArrayParams(searchParams, "venueIds", params.venueIds);
  appendArrayParams(searchParams, "genreIds", params.genreIds);

  const queryString = searchParams.toString();
  const suffix = queryString ? `?${queryString}` : "";

  const response = await api.get<PageResponse<UpcomingMovie>>(
    `${API_ENDPOINTS.upcomingMovies.list}${suffix}`,
  );

  return response.data;
}

export async function getUpcomingMoviesFilters(): Promise<UpcomingMoviesFiltersResponse> {
  const response = await api.get<UpcomingMoviesFiltersResponse>(
    API_ENDPOINTS.upcomingMovies.filters,
  );

  return response.data;
}

export async function getUpcomingVenuesByCities(
  cityIds: string[],
): Promise<FilterOption[]> {
  const searchParams = new URLSearchParams();

  cityIds.forEach((cityId) => {
    searchParams.append("cityIds", cityId);
  });

  const queryString = searchParams.toString();
  const suffix = queryString ? `?${queryString}` : "";

  const response = await api.get<FilterOption[]>(
    `${API_ENDPOINTS.upcomingMovies.venuesByCities}${suffix}`,
  );

  return response.data;
}
