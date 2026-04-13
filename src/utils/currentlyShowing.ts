const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});

function toLocalIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayIsoDate() {
  return toLocalIsoDate(new Date());
}

export function getTenDayRange() {
  const todayIsoDate = getTodayIsoDate();
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  return Array.from({ length: 10 }, (_, index) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + index);

    const isoDate = toLocalIsoDate(date);
    const label = DATE_FORMATTER.format(date);
    const weekday =
      isoDate === todayIsoDate ? "Today" : WEEKDAY_FORMATTER.format(date);

    return {
      isoDate,
      label,
      weekday,
      isToday: isoDate === todayIsoDate,
    };
  });
}

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

export function getVisibleMovieCount(page: number, totalElements: number) {
  return Math.min((page + 1) * 9, totalElements);
}
