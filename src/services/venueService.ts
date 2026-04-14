import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { PageResponse } from "@/types/common";
import type { VenueCardItem } from "@/types/homepage";

export async function getVenues(
  page = 0,
  size = 10,
): Promise<PageResponse<VenueCardItem>> {
  const response = await api.get<PageResponse<VenueCardItem>>(
    API_ENDPOINTS.venues.list,
    {
      params: { page, size },
    },
  );

  return response.data;
}
