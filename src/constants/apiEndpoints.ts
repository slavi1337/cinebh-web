export const API_ENDPOINTS = {
  movies: {
    hero: "/api/movies/hero",
    currentlyShowing: "/api/movies/currently-showing",
    upcoming: "/api/movies/upcoming",
  },
  venues: {
    list: "/api/venues",
  },
} as const;
