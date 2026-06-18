import { useState } from "react";
import FilterSelect from "@/components/common/FilterSelect";
import GroupedShowtimes from "@/components/showtimes/GroupedShowtimes";
import CinemaIcon from "@/components/ui/icons/CinemaIcon";
import LeftArrowIcon from "@/components/ui/icons/LeftArrowIcon";
import LocationPinIcon from "@/components/ui/icons/LocationPinIcon";
import RightArrowIcon from "@/components/ui/icons/RightArrowIcon";
import type { BookingMode } from "@/types/booking";
import type { FilterOption } from "@/types/common";
import type { MovieDetails, MovieProjection } from "@/types/movieDetails";
import { isProjectionTimePassed } from "@/utils/projectionTime";
type MovieScheduleCardProps = {
  movie: MovieDetails;
  availableVenues: FilterOption[];
  selectedDate: string;
  selectedCityId: string;
  selectedVenueId: string;
  selectedProjectionId: string;
  projections: MovieProjection[];
  onDateChange: (date: string) => void;
  onCityChange: (cityId: string) => void;
  onVenueChange: (venueId: string) => void;
  onProjectionChange: (projectionId: string) => void;
  onTicketAction: (projectionId: string, mode: BookingMode) => void;
  onExpiredProjectionSelect: () => void;
};
const DATE_PAGE_SIZE = 5;
const MAX_VISIBLE_DATES = 10;

function isSameDate(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}
function getDateLabel(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);
  const today = new Date();

  return {
    day: parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    weekday: isSameDate(parsedDate, today)
      ? "Today"
      : parsedDate.toLocaleDateString("en-US", {
          weekday: "short",
        }),
  };
}
export default function MovieScheduleCard({
  movie,
  availableVenues,
  selectedDate,
  selectedCityId,
  selectedVenueId,
  selectedProjectionId,
  projections,
  onDateChange,
  onCityChange,
  onVenueChange,
  onProjectionChange,
  onTicketAction,
  onExpiredProjectionSelect,
}: MovieScheduleCardProps) {
  const [datePage, setDatePage] = useState(0);
  const limitedProjectionDates = movie.projectionDates.slice(
    0,
    MAX_VISIBLE_DATES,
  );
  const totalDatePages = Math.ceil(
    limitedProjectionDates.length / DATE_PAGE_SIZE,
  );
  const boundedDatePage = Math.min(datePage, Math.max(totalDatePages - 1, 0));
  const visibleProjectionDates = limitedProjectionDates.slice(
    boundedDatePage * DATE_PAGE_SIZE,
    boundedDatePage * DATE_PAGE_SIZE + DATE_PAGE_SIZE,
  );
  const canGoBack = boundedDatePage > 0;
  const canGoForward = boundedDatePage + 1 < totalDatePages;
  const selectedProjection = projections.find(
    (projection) => projection.projectionId === selectedProjectionId,
  );
  const isSelectedProjectionPassed = selectedProjection
    ? isProjectionTimePassed(selectedDate, selectedProjection.startTime)
    : false;
  const canStartTicketAction =
    Boolean(selectedProjection) && !isSelectedProjectionPassed;

  function handleProtectedAction(mode: BookingMode) {
    if (!selectedProjection || !canStartTicketAction) {
      return;
    }

    onTicketAction(selectedProjection.projectionId, mode);
  }

  return (
    <section className="rounded-3xl border border-movie-details-border bg-movie-details-card-background shadow-[0px_8px_18px_rgba(52,64,84,0.08)]">
      <div className="p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FilterSelect
            value={selectedCityId}
            onChange={onCityChange}
            options={movie.cities}
            placeholder="Choose City"
            icon={<LocationPinIcon />}
          />
          <FilterSelect
            value={selectedVenueId}
            onChange={onVenueChange}
            options={availableVenues}
            placeholder="Choose Cinema"
            icon={<CinemaIcon />}
            disabled={!selectedCityId}
          />
        </div>
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(86px,1fr))] gap-3">
          {movie.projectionDates.length ? (
            visibleProjectionDates.map((date) => {
              const isSelected = date === selectedDate;
              const label = getDateLabel(date);
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => onDateChange(date)}
                  className={`h-17 min-w-21.5 cursor-pointer rounded-lg border px-3 text-center shadow-page-input transition-colors ${
                    isSelected
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-movie-details-border bg-white text-movie-details-heading hover:border-brand-red/50"
                  }`}
                >
                  <div className="whitespace-nowrap text-body-md font-bold">
                    {label.day}
                  </div>
                  <div
                    className={`text-[14px] leading-5 ${
                      isSelected ? "text-white" : "text-page-muted"
                    }`}
                  >
                    {label.weekday}
                  </div>
                </button>
              );
            })
          ) : (
            <p className="col-span-full text-body-md text-page-muted">
              No projection dates available.
            </p>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            disabled={!canGoBack}
            onClick={() =>
              setDatePage((currentDatePage) =>
                Math.max(currentDatePage - 1, 0),
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-movie-details-border bg-white text-pagination-button-icon transition-colors enabled:cursor-pointer enabled:hover:border-brand-red/50 disabled:cursor-not-allowed disabled:text-pagination-button-icon-disabled"
          >
            <LeftArrowIcon />
          </button>
          <button
            type="button"
            disabled={!canGoForward}
            onClick={() =>
              setDatePage((currentDatePage) =>
                Math.min(currentDatePage + 1, totalDatePages - 1),
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-movie-details-border bg-white text-pagination-button-icon transition-colors enabled:cursor-pointer enabled:hover:border-brand-red/50 disabled:cursor-not-allowed disabled:text-pagination-button-icon-disabled"
          >
            <RightArrowIcon />
          </button>
        </div>
        <div className="mt-8">
          <h3 className="text-[20px] leading-6 font-bold tracking-[-0.0015em] text-movie-details-heading">
            Showtimes
          </h3>
          <div className="mt-4">
            <GroupedShowtimes
              showtimes={projections}
              emptyLabel="No projection times available for selected filters."
              selectedProjectionId={selectedProjectionId}
              isShowtimeUnavailable={(projection) =>
                isProjectionTimePassed(selectedDate, projection.startTime)
              }
              onUnavailableShowtimeClick={onExpiredProjectionSelect}
              onShowtimeClick={(projection) =>
                onProjectionChange(projection.projectionId)
              }
            />
          </div>
        </div>
      </div>
      <div className="mt-12 grid gap-4 border-t border-movie-details-border p-5 md:grid-cols-2 md:p-6">
        <button
          type="button"
          disabled={!canStartTicketAction}
          onClick={() => handleProtectedAction("reserve")}
          className="h-12 rounded-lg border border-brand-red bg-white text-body-md font-semibold text-brand-red transition-colors enabled:cursor-pointer disabled:cursor-not-allowed disabled:border-movie-details-border disabled:text-movie-details-border"
        >
          Reserve Ticket
        </button>
        <button
          type="button"
          disabled={!canStartTicketAction}
          onClick={() => handleProtectedAction("buy")}
          className="h-12 rounded-lg bg-brand-red text-body-md font-semibold text-white transition-colors enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-movie-details-border"
        >
          Buy Ticket
        </button>
      </div>
    </section>
  );
}
