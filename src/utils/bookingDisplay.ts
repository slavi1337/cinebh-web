import type { SelectedSeat } from "@/types/booking";

export function formatBookingDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${dateLabel} at ${timeLabel}`;
}

export function formatBookingAmount(value: number) {
  return `${Number(value).toFixed(2)} BAM`;
}

export function formatBookingDuration(durationMinutes: number | null) {
  return durationMinutes ? `${durationMinutes} Min` : null;
}

export function seatLabel(seat: SelectedSeat) {
  return `${seat.row}${seat.number}`;
}
