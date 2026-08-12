import type { SelectedSeat } from "@/types/booking";

export type UserProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  profileImageUrl: string | null;
  cityId: string | null;
  cityName: string | null;
  country: string | null;
  streetAddress: string | null;
};

export type UpdateUserProfileRequest = {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  cityId: string | null;
  streetAddress: string | null;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

export type CityOption = {
  id: string;
  name: string;
};

export type CountryOption = {
  country: string;
  cities: CityOption[];
};

export type ProfileLocationOptions = {
  countries: CountryOption[];
};

export type ProjectionHistoryStatus = "upcoming" | "past";

export type UserProjection = {
  bookingId: string;
  ticketCode: string;
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
  totalPrice: number;
  seats: SelectedSeat[];
};
