import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { getApiBaseUrl } from "@/constants/apiConfig";
import api from "@/services/api";
import type {
  BookingHold,
  BookingHoldRequest,
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  SeatMap,
} from "@/types/booking";

export async function getProjectionSeatMap(
  projectionId: string,
): Promise<SeatMap> {
  const response = await api.get<SeatMap>(
    API_ENDPOINTS.projections.seatMap(projectionId),
  );
  return response.data;
}

export async function holdBookingSeats(
  request: BookingHoldRequest,
): Promise<BookingHold> {
  const response = await api.post<BookingHold>(
    API_ENDPOINTS.bookings.holds,
    request,
  );
  return response.data;
}

export async function cancelBookingHold(bookingId: string): Promise<void> {
  await api.delete(API_ENDPOINTS.bookings.hold(bookingId));
}

export async function createCheckoutSession(
  request: CheckoutSessionRequest,
): Promise<CheckoutSessionResponse> {
  const response = await api.post<CheckoutSessionResponse>(
    API_ENDPOINTS.payments.checkoutSessions,
    request,
  );
  return response.data;
}

export function getProjectionSeatWebSocketUrl(projectionId: string) {
  const url = new URL(getApiBaseUrl());
  const basePath = url.pathname.replace(/\/$/, "");

  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `${basePath}${API_ENDPOINTS.websocket.projectionSeats(
    projectionId,
  )}`;
  url.search = "";

  return url.toString();
}
