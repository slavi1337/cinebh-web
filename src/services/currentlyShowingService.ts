import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { appendArrayParams } from "@/utils/api";
import type { FilterOption, PageResponse } from "@/types/common";
import type {
  CurrentlyShowingFiltersResponse,
  CurrentlyShowingMovie,
  CurrentlyShowingQueryParams,
} from "@/types/currentlyShowing";

export async function getCurrentlyShowing(
  params: CurrentlyShowingQueryParams,
): Promise<PageResponse<CurrentlyShowingMovie>> {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set("query", params.query);
  if (params.date) searchParams.set("date", params.date);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  appendArrayParams(searchParams, "cityIds", params.cityIds);
  appendArrayParams(searchParams, "venueIds", params.venueIds);
  appendArrayParams(searchParams, "genreIds", params.genreIds);
  appendArrayParams(searchParams, "projectionTimes", params.projectionTimes);

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const response = await api.get<PageResponse<CurrentlyShowingMovie>>(
    `${API_ENDPOINTS.currentlyShowing.list}${suffix}`,
  );

  return response.data;
}

export async function getCurrentlyShowingFilters(): Promise<CurrentlyShowingFiltersResponse> {
  const response = await api.get<CurrentlyShowingFiltersResponse>(
    API_ENDPOINTS.currentlyShowing.filters,
  );

  return response.data;
}

export async function getVenuesByCities(
  cityIds: string[],
): Promise<FilterOption[]> {
  const searchParams = new URLSearchParams();

  cityIds.forEach((cityId) => {
    searchParams.append("cityIds", cityId);
  });

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const response = await api.get<FilterOption[]>(
    `${API_ENDPOINTS.currentlyShowing.venuesByCities}${suffix}`,
  );

  return response.data;
}
