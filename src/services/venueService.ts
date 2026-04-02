import api from "@/services/api";
import type { PageResponse, VenueCardItem } from "@/types/homepage";

export async function getVenues(
  page = 0,
  size = 10,
): Promise<PageResponse<VenueCardItem>> {
  const response = await api.get<PageResponse<VenueCardItem>>("/api/venues", {
    params: { page, size },
  });

  return response.data;
}
