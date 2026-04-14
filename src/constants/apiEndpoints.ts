export const API_ENDPOINTS = {
  movies: {
    hero: "/api/movies/hero",
    currentlyShowing: "/api/movies/currently-showing",
    upcoming: "/api/movies/upcoming",
  },
  currentlyShowing: {
    list: "/api/currently-showing",
    filters: "/api/currently-showing/filters",
    venuesByCities: "/api/currently-showing/filters/venues",
  },
  venues: {
    list: "/api/venues",
  },
} as const;
