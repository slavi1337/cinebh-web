export type ShowtimesProjection = {
  projectionId: string;
  startTime: string;
  venueId: string;
  venueName: string;
  cityId: string;
  cityName: string;
  hallId: string;
  hallName: string;
};

type GroupedShowtimesProps<TShowtime extends ShowtimesProjection> = {
  showtimes: TShowtime[];
  emptyLabel: string;
  selectedProjectionId?: string;
  maxHeightClassName?: string;
  isShowtimeUnavailable?: (showtime: TShowtime) => boolean;
  onShowtimeClick: (showtime: TShowtime) => void;
  onUnavailableShowtimeClick?: (showtime: TShowtime) => void;
};

type ShowtimeGroup<TShowtime extends ShowtimesProjection> = {
  key: string;
  label: string;
  cityName: string;
  venueName: string;
  hallName: string;
  showtimes: TShowtime[];
};

function formatShowtimeLabel(time: string) {
  return time.slice(0, 5);
}

function venueHallLabel(showtime: ShowtimesProjection) {
  return `${showtime.venueName} - ${showtime.cityName} (${showtime.hallName})`;
}

function groupShowtimes<TShowtime extends ShowtimesProjection>(
  showtimes: TShowtime[],
) {
  const groupsByKey = new Map<string, ShowtimeGroup<TShowtime>>();

  showtimes.forEach((showtime) => {
    const key = `${showtime.cityId}:${showtime.venueId}:${showtime.hallId}`;
    const group = groupsByKey.get(key);

    if (group) {
      group.showtimes.push(showtime);
      return;
    }

    groupsByKey.set(key, {
      key,
      label: venueHallLabel(showtime),
      cityName: showtime.cityName,
      venueName: showtime.venueName,
      hallName: showtime.hallName,
      showtimes: [showtime],
    });
  });

  return Array.from(groupsByKey.values())
    .sort((firstGroup, secondGroup) => {
      const cityComparison = firstGroup.cityName.localeCompare(
        secondGroup.cityName,
      );

      if (cityComparison !== 0) {
        return cityComparison;
      }

      const venueComparison = firstGroup.venueName.localeCompare(
        secondGroup.venueName,
      );

      if (venueComparison !== 0) {
        return venueComparison;
      }

      return firstGroup.hallName.localeCompare(secondGroup.hallName);
    })
    .map((group) => ({
      ...group,
      showtimes: [...group.showtimes].sort((firstShowtime, secondShowtime) =>
        firstShowtime.startTime.localeCompare(secondShowtime.startTime),
      ),
    }));
}

export default function GroupedShowtimes<
  TShowtime extends ShowtimesProjection,
>({
  showtimes,
  emptyLabel,
  selectedProjectionId,
  maxHeightClassName = "max-h-80",
  isShowtimeUnavailable,
  onShowtimeClick,
  onUnavailableShowtimeClick,
}: GroupedShowtimesProps<TShowtime>) {
  const groups = groupShowtimes(showtimes);

  if (groups.length === 0) {
    return <p className="text-body-md text-page-muted">{emptyLabel}</p>;
  }

  return (
    <div className={`${maxHeightClassName} overflow-y-auto pr-2`}>
      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.key}>
            <h4 className="text-body-md font-bold text-brand-red">
              {group.label}
            </h4>
            <div className="mt-3 flex flex-wrap gap-3">
              {group.showtimes.map((showtime) => {
                const isSelected =
                  selectedProjectionId === showtime.projectionId;
                const isUnavailable =
                  isShowtimeUnavailable?.(showtime) ?? false;

                return (
                  <button
                    key={showtime.projectionId}
                    type="button"
                    aria-disabled={isUnavailable}
                    title={
                      isUnavailable
                        ? "This projection time has already passed."
                        : undefined
                    }
                    onClick={() => {
                      if (isUnavailable) {
                        onUnavailableShowtimeClick?.(showtime);
                        return;
                      }

                      onShowtimeClick(showtime);
                    }}
                    className={`inline-flex h-12 min-w-17.75 cursor-pointer items-center justify-center rounded-lg border px-4 text-[20px] leading-6 font-bold tracking-[-0.0015em] shadow-page-input transition-colors ${
                      isUnavailable
                        ? "border-movie-details-border bg-white text-page-muted"
                        : isSelected
                          ? "border-brand-red bg-brand-red text-white"
                          : "border-border-default bg-white text-page-heading hover:border-brand-red hover:text-brand-red"
                    }`}
                  >
                    {formatShowtimeLabel(showtime.startTime)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
