import { useEffect, useMemo, useState } from "react";
import FilterSelect from "@/components/common/FilterSelect";
import CurrentlyShowingCard from "@/components/currently-showing/CurrentlyShowingCard";
import ContentEmptyState from "@/components/common/ContentEmptyState";
import PageStatusCard from "@/components/common/PageStatusCard";
import DateSelector from "@/components/currently-showing/DateSelector";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import LocationPinIcon from "@/components/ui/icons/LocationPinIcon";
import CinemaIcon from "@/components/ui/icons/CinemaIcon";
import GenresIcon from "@/components/ui/icons/GenresIcon";
import ClockIcon from "@/components/ui/icons/ClockIcon";
import useListingSearchParams from "@/hooks/useListingSearchParams";
import {
  getCurrentlyShowing,
  getCurrentlyShowingFilters,
  getVenuesByCities,
} from "@/services/currentlyShowingService";
import type { FilterOption, PageResponse } from "@/types/common";
import type { CurrentlyShowingMovie } from "@/types/currentlyShowing";
import { getTodayIsoDate } from "@/utils/date";
import { getVisibleItemCount } from "@/utils/pagination";
import { MOVIE_SEARCH_MAX_LENGTH } from "@/constants/search";

const PAGE_SIZE = 9;

export default function CurrentlyShowingPage() {
  const {
    searchParams,
    setSearchParams,
    query,
    page,
    getArrayParam,
    updateParams,
    setNextPage,
  } = useListingSearchParams();

  const todayIsoDate = getTodayIsoDate();
  const selectedDate = searchParams.get("date") ?? todayIsoDate;

  const cityIds = useMemo(() => getArrayParam("cityIds"), [getArrayParam]);
  const venueIds = useMemo(() => getArrayParam("venueIds"), [getArrayParam]);
  const genreIds = useMemo(() => getArrayParam("genreIds"), [getArrayParam]);
  const projectionTimes = useMemo(
    () => getArrayParam("projectionTimes"),
    [getArrayParam],
  );

  const [searchValue, setSearchValue] = useState(query);
  const [movies, setMovies] = useState<CurrentlyShowingMovie[]>([]);
  const [filters, setFilters] = useState<{
    cities: FilterOption[];
    venues: FilterOption[];
    genres: FilterOption[];
  }>({
    cities: [],
    venues: [],
    genres: [],
  });
  const [filteredVenues, setFilteredVenues] = useState<FilterOption[]>([]);
  const [pageResponse, setPageResponse] =
    useState<PageResponse<CurrentlyShowingMovie> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltersLoading, setIsFiltersLoading] = useState(true);
  const [isFiltersError, setIsFiltersError] = useState(false);
  const [isError, setIsError] = useState(false);

  const hasActiveFilters = Boolean(
    query ||
    cityIds.length ||
    venueIds.length ||
    genreIds.length ||
    projectionTimes.length,
  );

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    if (!searchParams.get("date")) {
      const next = new URLSearchParams(searchParams);
      next.set("date", todayIsoDate);
      next.set("page", "0");
      setSearchParams(next, { replace: true, preventScrollReset: true });
    }
  }, [searchParams, setSearchParams, todayIsoDate]);

  useEffect(() => {
    async function loadFilters() {
      try {
        setIsFiltersLoading(true);
        setIsFiltersError(false);

        const response = await getCurrentlyShowingFilters();
        setFilters(response);
        setFilteredVenues(response.venues);
      } catch {
        setIsFiltersError(true);
        setFilters({
          cities: [],
          venues: [],
          genres: [],
        });
        setFilteredVenues([]);
      } finally {
        setIsFiltersLoading(false);
      }
    }

    void loadFilters();
  }, []);

  useEffect(() => {
    async function loadVenues() {
      try {
        if (!cityIds.length) {
          setFilteredVenues(filters.venues);
          return;
        }

        const venues = await getVenuesByCities(cityIds);
        setFilteredVenues(venues);
      } catch {
        setFilteredVenues([]);
      }
    }

    void loadVenues();
  }, [cityIds, filters.venues]);

  useEffect(() => {
    let isCancelled = false;

    async function loadMovies() {
      try {
        if (page === 0) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        setIsError(false);

        const response = await getCurrentlyShowing({
          query: query || undefined,
          cityIds,
          venueIds,
          genreIds,
          date: selectedDate,
          projectionTimes,
          page,
          size: PAGE_SIZE,
        });

        if (isCancelled) return;

        setPageResponse(response);
        setMovies((prevMovies) =>
          page === 0 ? response.items : [...prevMovies, ...response.items],
        );
      } catch {
        if (!isCancelled) {
          setIsError(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    }

    void loadMovies();

    return () => {
      isCancelled = true;
    };
  }, [query, cityIds, venueIds, genreIds, selectedDate, projectionTimes, page]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedSearchValue = searchValue.trim();

    updateParams(
      { query: normalizedSearchValue || null },
      { preserve: { date: todayIsoDate } },
    );
  }

  function handleSingleSelectParam(key: string, value: string) {
    updateParams(
      { [key]: value ? [value] : null },
      { preserve: { date: todayIsoDate } },
    );
  }

  function handleDateSelect(date: string) {
    updateParams({ date }, { preserve: { date: todayIsoDate } });
  }

  const selectedCity = cityIds[0] ?? "";
  const selectedVenue = venueIds[0] ?? "";
  const selectedGenre = genreIds[0] ?? "";
  const selectedProjectionTime = projectionTimes[0] ?? "";

  const visibleCount = useMemo(() => {
    if (!pageResponse) return 0;
    return getVisibleItemCount(page, pageResponse.totalElements, PAGE_SIZE);
  }, [page, pageResponse]);

  const hasMore = pageResponse !== null && page < pageResponse.totalPages - 1;

  const availableProjectionTimes = useMemo(() => {
    const uniqueTimes = new Set<string>();

    movies.forEach((movie) => {
      movie.showtimes.forEach((showtime) => {
        uniqueTimes.add(showtime.startTime.slice(0, 5));
      });
    });

    return Array.from(uniqueTimes)
      .sort()
      .map((time) => ({
        id: time,
        label: time,
      }));
  }, [movies]);

  const emptyStateTitle = hasActiveFilters
    ? "No movies found for selected filters"
    : "No movies to preview for current date";

  const emptyStateDescription = hasActiveFilters
    ? "Try adjusting your search or filters to explore available movies and showtimes."
    : "We are working on updating our schedule for upcoming movies. Stay tuned for amazing movie experience or explore our other exciting cinema features in the meantime!";

  return (
    <div className="min-h-screen bg-page-background">
      <div className="mx-auto w-full max-w-360 px-4 pt-12 pb-20 md:px-8 lg:px-23">
        <h1 className="text-[32px] leading-10 tracking-[-0.0025em] font-bold text-page-heading">
          Currently Showing{visibleCount > 0 ? ` (${visibleCount})` : ""}
        </h1>

        <form onSubmit={handleSearchSubmit} className="mt-6">
          <div className="relative">
            <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-icon-default">
              <SearchIcon />
            </div>

            <input
              value={searchValue}
              maxLength={MOVIE_SEARCH_MAX_LENGTH}
              onChange={(event) =>
                setSearchValue(
                  event.target.value.slice(0, MOVIE_SEARCH_MAX_LENGTH),
                )
              }
              placeholder="Search Movies"
              className="h-12 w-full rounded-lg border border-border-default bg-white pr-4 pl-11 text-body-md text-page-muted shadow-page-input outline-none"
            />
          </div>
        </form>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            value={selectedCity}
            onChange={(value) => {
              updateParams(
                {
                  cityIds: value ? [value] : null,
                  venueIds: null,
                  projectionTimes: null,
                },
                { preserve: { date: todayIsoDate } },
              );
            }}
            options={filters.cities}
            placeholder="All Cities"
            icon={<LocationPinIcon />}
            disabled={isFiltersLoading || isFiltersError}
          />

          <FilterSelect
            value={selectedVenue}
            onChange={(value) => {
              updateParams(
                {
                  venueIds: value ? [value] : null,
                  projectionTimes: null,
                },
                { preserve: { date: todayIsoDate } },
              );
            }}
            options={filteredVenues}
            placeholder="All Cinemas"
            icon={<CinemaIcon />}
            disabled={isFiltersLoading || isFiltersError}
          />

          <FilterSelect
            value={selectedGenre}
            onChange={(value) => handleSingleSelectParam("genreIds", value)}
            options={filters.genres}
            placeholder="All Genres"
            icon={<GenresIcon />}
            disabled={isFiltersLoading || isFiltersError}
          />

          <FilterSelect
            value={selectedProjectionTime}
            onChange={(value) =>
              handleSingleSelectParam("projectionTimes", value)
            }
            options={availableProjectionTimes}
            placeholder="All Projection Times"
            icon={<ClockIcon />}
            disabled={!selectedVenue || isFiltersLoading || isFiltersError}
          />
        </div>

        <div className="mt-6">
          <DateSelector
            selectedDate={selectedDate}
            onSelect={handleDateSelect}
          />
        </div>

        <p className="mt-4 text-[14px] leading-5 tracking-[0.0025em] italic text-page-muted">
          Quick reminder that our cinema schedule is on a ten-day update cycle.
        </p>

        <div className="mt-4">
          {isLoading ? (
            <PageStatusCard label="Loading currently showing movies..." />
          ) : isError ? (
            <PageStatusCard label="Something went wrong while loading currently showing movies." />
          ) : movies.length === 0 ? (
            <ContentEmptyState
              title={emptyStateTitle}
              description={emptyStateDescription}
            />
          ) : (
            <>
              <div className="space-y-5">
                {movies.map((movie) => (
                  <CurrentlyShowingCard key={movie.movieId} movie={movie} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={setNextPage}
                    disabled={isLoadingMore}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-lg bg-white px-5 text-body-md font-semibold text-brand-red underline transition-colors hover:bg-brand-red hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoadingMore ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
