import type { FilterOption } from "@/types/common";

export type FilterParamUpdates = Record<string, string | string[] | null>;

type VenueFilterUpdateOptions = {
  resetProjectionTimes?: boolean;
};

export function buildVenueFilterUpdates(
  venueId: string,
  filteredVenues: FilterOption[],
  allVenues: FilterOption[],
  options: VenueFilterUpdateOptions = {},
): FilterParamUpdates {
  const updates: FilterParamUpdates = {
    venueIds: venueId ? [venueId] : null,
  };

  if (options.resetProjectionTimes) {
    updates.projectionTimes = null;
  }

  if (!venueId) {
    return updates;
  }

  const selectedVenue =
    filteredVenues.find((venue) => venue.id === venueId) ??
    allVenues.find((venue) => venue.id === venueId);

  if (selectedVenue?.cityId) {
    updates.cityIds = [selectedVenue.cityId];
  }

  return updates;
}
