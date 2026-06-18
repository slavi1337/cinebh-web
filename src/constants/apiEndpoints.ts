export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    verify: "/auth/verify",
    refresh: "/auth/refresh",
    me: "/auth/me",
    logout: "/auth/logout",
    googleOAuth: "/oauth2/authorization/google",
  },
  movies: {
    hero: "/movies/hero",
    currentlyShowing: "/movies/currently-showing",
    upcoming: "/movies/upcoming",
    details: (movieId: string) => `/movies/${movieId}/details`,
    projections: (movieId: string) => `/movies/${movieId}/projections`,
  },
  projections: {
    seatMap: (projectionId: string) => `/projections/${projectionId}/seat-map`,
  },
  bookings: {
    holds: "/bookings/holds",
    hold: (bookingId: string) => `/bookings/holds/${bookingId}`,
    reserveHold: (bookingId: string) => `/bookings/holds/${bookingId}/reserve`,
    reservations: "/bookings/reservations",
    reservation: (bookingId: string) => `/bookings/reservations/${bookingId}`,
  },
  payments: {
    checkoutSessions: "/payments/checkout-sessions",
  },
  tickets: {
    validate: (ticketCode: string) => `/tickets/${ticketCode}`,
  },
  users: {
    profile: "/users/me/profile",
    profileImage: "/users/me/profile-image",
    profileOptions: "/users/me/profile/options",
    password: "/users/me/password",
    projections: "/users/me/projections",
  },
  websocket: {
    projectionSeats: (projectionId: string) =>
      `/ws/projections/${projectionId}/seats`,
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
