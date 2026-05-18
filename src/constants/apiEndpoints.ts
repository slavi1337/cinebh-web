export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    verify: "/auth/verify",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  movies: {
    hero: "/movies/hero",
    currentlyShowing: "/movies/currently-showing",
    upcoming: "/movies/upcoming",
  },
  currentlyShowing: {
    list: "/currently-showing",
    filters: "/currently-showing/filters",
    venuesByCities: "/currently-showing/filters/venues",
  },
  upcomingMovies: {
    list: "/upcoming-movies",
    filters: "/upcoming-movies/filters",
    venuesByCities: "/upcoming-movies/filters/venues",
  },
  venues: {
    list: "/venues",
  },
} as const;
