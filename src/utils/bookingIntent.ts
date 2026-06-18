import type { BookingIntent } from "@/types/booking";

const BOOKING_INTENT_KEY = "cinebh.booking.intent";
const BOOKING_INTENT_TTL_MS = 15 * 60 * 1000;

export function saveBookingIntent(intent: Omit<BookingIntent, "createdAt">) {
  sessionStorage.setItem(
    BOOKING_INTENT_KEY,
    JSON.stringify({ ...intent, createdAt: Date.now() }),
  );
}

export function readBookingIntent(): BookingIntent | null {
  const value = sessionStorage.getItem(BOOKING_INTENT_KEY);

  if (!value) {
    return null;
  }

  try {
    const intent = JSON.parse(value) as BookingIntent;
    const isExpired = Date.now() - intent.createdAt > BOOKING_INTENT_TTL_MS;

    if (isExpired || !intent.movieId || !intent.projectionId) {
      clearBookingIntent();
      return null;
    }

    return intent;
  } catch {
    clearBookingIntent();
    return null;
  }
}

export function clearBookingIntent() {
  sessionStorage.removeItem(BOOKING_INTENT_KEY);
}
