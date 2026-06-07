const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});

export function toLocalIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function toNullableLocalIsoDate(date?: Date | null) {
  if (!date) return null;
  return toLocalIsoDate(date);
}

export function parseLocalIsoDate(value?: string | null) {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateInputValue(date?: Date | null) {
  if (!date) return "YYYY/MM/DD";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

export function formatIsoDateInputValue(value?: string | null) {
  return formatDateInputValue(parseLocalIsoDate(value));
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
