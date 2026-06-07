export function formatUpcomingDuration(durationMinutes: number | null) {
  if (!durationMinutes) return null;

  return `${durationMinutes} MIN`;
}

export function formatOpeningLabel(openingDate: string) {
  const date = new Date(`${openingDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayDiff = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (dayDiff >= 0 && dayDiff <= 6) {
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(date);

    return `Opens ${weekday}`;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatUpcomingGenres(genres: string[]) {
  return genres.join(", ");
}
