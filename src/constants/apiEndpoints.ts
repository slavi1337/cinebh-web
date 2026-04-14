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
  upcomingMovies: {
    list: "/api/upcoming-movies",
    filters: "/api/upcoming-movies/filters",
    venuesByCities: "/api/upcoming-movies/filters/venues",
  },
  venues: {
    list: "/api/venues",
  },
} as const;
