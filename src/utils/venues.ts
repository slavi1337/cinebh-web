export function formatVenueLabel(venueName: string, cityName: string) {
  return `${venueName} (${cityName})`;
}

export function formatVenueSummary(venues: string[]) {
  if (!venues.length) {
    return "No cinemas listed";
  }
  if (venues.length <= 3) {
    return venues.join(", ");
  }
  return `${venues.slice(0, 3).join(", ")}...`;
}
