export type SeatType = "REGULAR" | "LOVE" | "VIP";

export type SeatAvailabilityStatus = "AVAILABLE" | "HELD" | "RESERVED" | "PAID";

export type Seat = {
  id: string;
  row: string;
  number: string;
  type: SeatType;
  price: number;
  status: SeatAvailabilityStatus;
  selectedByCurrentUser: boolean;
};

export type SelectedSeat = {
  id: string;
  row: string;
  number: string;
  type: SeatType;
  price: number;
};

export type BookingHold = {
  bookingId: string;
  projectionId: string;
  expiresAt: string;
  totalPrice: number;
  seats: SelectedSeat[];
};

export type SeatMap = {
  projectionId: string;
  movieId: string;
  movieTitle: string;
  posterImageUrl: string | null;
  pgRating: string | null;
  language: string | null;
  durationMinutes: number | null;
  cityName: string;
  venueName: string;
  hallName: string;
  startTime: string;
  endTime: string;
  seats: Seat[];
  activeHold: BookingHold | null;
};

export type BookingHoldRequest = {
  projectionId: string;
  seatTemplateIds: string[];
};

export type CheckoutSessionRequest = {
  bookingId: string;
};

export type CheckoutSessionResponse = {
  sessionUrl: string;
};

export type Reservation = {
  bookingId: string;
  movieId: string;
  projectionId: string;
  movieTitle: string;
  posterImageUrl: string | null;
  pgRating: string | null;
  language: string | null;
  durationMinutes: number | null;
  cityName: string;
  venueName: string;
  hallName: string;
  projectionStartTime: string;
  expiresAt: string;
  totalPrice: number;
  seats: SelectedSeat[];
};

export type BookingMode = "buy" | "reserve";

export type BookingIntent = {
  movieId: string;
  projectionId: string;
  mode: BookingMode;
  createdAt: number;
};
