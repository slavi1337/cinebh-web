import FilterSelect from "@/components/common/FilterSelect";
import CinemaIcon from "@/components/ui/icons/CinemaIcon";
import LeftArrowIcon from "@/components/ui/icons/LeftArrowIcon";
import LocationPinIcon from "@/components/ui/icons/LocationPinIcon";
import RightArrowIcon from "@/components/ui/icons/RightArrowIcon";
import type { FilterOption } from "@/types/common";
import type { MovieDetails, MovieProjection } from "@/types/movieDetails";
type MovieScheduleCardProps = {
  movie: MovieDetails;
  availableVenues: FilterOption[];
  selectedDate: string;
  selectedCityId: string;
  selectedVenueId: string;
  selectedProjectionId: string;
  projections: MovieProjection[];
  isAuthenticated: boolean;
  onDateChange: (date: string) => void;
  onCityChange: (cityId: string) => void;
  onVenueChange: (venueId: string) => void;
  onProjectionChange: (projectionId: string) => void;
  onAuthRequired: () => void;
};
function getDateLabel(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);
  return {
    day: parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    weekday: parsedDate.toLocaleDateString("en-US", {
      weekday: "short",
    }),
  };
}
function formatProjectionTime(time: string) {
  return time.slice(0, 5);
}
export default function MovieScheduleCard({
  movie,
  availableVenues,
  selectedDate,
  selectedCityId,
  selectedVenueId,
  selectedProjectionId,
  projections,
  isAuthenticated,
  onDateChange,
  onCityChange,
  onVenueChange,
  onProjectionChange,
  onAuthRequired,
}: MovieScheduleCardProps) {
  const selectedProjection = projections.find(
    (projection) => projection.projectionId === selectedProjectionId,
  );
  const hasCompleteSelection = Boolean(
    selectedCityId && selectedVenueId && selectedProjectionId,
  );
  const canStartAuthFlow = !isAuthenticated && hasCompleteSelection;
  const showComingSoonDisabled = isAuthenticated;
  function handleProtectedAction() {
    if (canStartAuthFlow) {
      onAuthRequired();
    }
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
            movie.projectionDates.map((date) => {
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
            disabled
            className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-lg border border-movie-details-border bg-white text-pagination-button-icon-disabled"
          >
            <LeftArrowIcon />
          </button>
          <button
            type="button"
            disabled
            className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-lg border border-movie-details-border bg-white text-pagination-button-icon-disabled"
          >
            <RightArrowIcon />
          </button>
        </div>
        <div className="mt-8">
          <h3 className="text-[20px] leading-6 font-bold tracking-[-0.0015em] text-movie-details-heading">
            Standard
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {projections.length ? (
              projections.map((projection) => {
                const isSelected =
                  projection.projectionId === selectedProjectionId;
                return (
                  <button
                    key={projection.projectionId}
                    type="button"
                    onClick={() => onProjectionChange(projection.projectionId)}
                    className={`h-12 cursor-pointer rounded-lg border px-4 text-body-md font-bold shadow-page-input transition-colors ${
                      isSelected
                        ? "border-brand-red bg-brand-red text-white"
                        : "border-movie-details-border bg-white text-movie-details-heading hover:border-brand-red/50"
                    }`}
                  >
                    {formatProjectionTime(projection.startTime)}
                  </button>
                );
              })
            ) : (
              <p className="text-body-md text-page-muted">
                No projection times available for selected filters.
              </p>
            )}
          </div>
          {selectedProjection && (
            <p className="mt-4 text-right text-[14px] leading-5 text-page-muted">
              Selected cinema:{" "}
              <span className="font-semibold text-page-heading">
                {selectedProjection.venueName} ({selectedProjection.cityName})
              </span>
            </p>
          )}
        </div>
      </div>
      <div className="mt-12 grid gap-4 border-t border-movie-details-border p-5 md:grid-cols-2 md:p-6">
        <button
          type="button"
          disabled={!canStartAuthFlow || showComingSoonDisabled}
          onClick={handleProtectedAction}
          className="h-12 rounded-lg border border-brand-red bg-white text-body-md font-semibold text-brand-red transition-colors enabled:cursor-pointer disabled:cursor-not-allowed disabled:border-movie-details-border disabled:text-movie-details-border"
        >
          Reserve Ticket
        </button>
        <button
          type="button"
          disabled={!canStartAuthFlow || showComingSoonDisabled}
          onClick={handleProtectedAction}
          className="h-12 rounded-lg bg-brand-red text-body-md font-semibold text-white transition-colors enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-movie-details-border"
        >
          Buy Ticket
        </button>
      </div>
    </section>
  );
}
