export function formatDuration(durationMinutes: number | null) {
  if (!durationMinutes) return null;
  return `${durationMinutes} Min`;
}

export function formatEndDate(endDate: string | null) {
  if (!endDate) return "Playing in cinema";

  const [year, month, day] = endDate.split("-");
  return `Playing in cinema until ${day}.${month}.${year}.`;
}

export function formatTimeLabel(time: string) {
  return time.slice(0, 5);
}
