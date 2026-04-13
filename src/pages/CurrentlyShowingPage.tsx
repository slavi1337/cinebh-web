import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSelect from "@/components/currently-showing/FilterSelect";
import CurrentlyShowingCard from "@/components/currently-showing/CurrentlyShowingCard";
import CurrentlyShowingEmptyState from "@/components/currently-showing/CurrentlyShowingEmptyState";
import DateSelector from "@/components/currently-showing/DateSelector";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import LocationPinIcon from "@/components/ui/icons/LocationPinIcon";
import CinemaIcon from "@/components/ui/icons/CinemaIcon";
import GenresIcon from "@/components/ui/icons/GenresIcon";
import ClockIcon from "@/components/ui/icons/ClockIcon";
import {
  getCurrentlyShowing,
  getCurrentlyShowingFilters,
  getVenuesByCities,
} from "@/services/currentlyShowingService";
import type {
  CurrentlyShowingMovie,
  FilterOption,
  PageResponse,
} from "@/types/currentlyShowing";
import {
  getTodayIsoDate,
  getVisibleMovieCount,
} from "@/utils/currentlyShowing";

const PAGE_SIZE = 9;

function getArrayParam(searchParams: URLSearchParams, key: string) {
  return searchParams.getAll(key);
}

export default function CurrentlyShowingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsString = searchParams.toString();
  const todayIsoDate = getTodayIsoDate();

  const query = searchParams.get("query") ?? "";
  const selectedDate = searchParams.get("date") ?? todayIsoDate;
  const page = Number(searchParams.get("page") ?? "0");

  const cityIds = useMemo(
    () => getArrayParam(searchParams, "cityIds"),
    [searchParamsString],
  );
  const venueIds = useMemo(
    () => getArrayParam(searchParams, "venueIds"),
    [searchParamsString],
  );
  const genreIds = useMemo(
    () => getArrayParam(searchParams, "genreIds"),
    [searchParamsString],
  );
  const projectionTimes = useMemo(
    () => getArrayParam(searchParams, "projectionTimes"),
    [searchParamsString],
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
        const response = await getCurrentlyShowingFilters();

        setFilters(response);
        setFilteredVenues(response.venues);
      } finally {
        setIsFiltersLoading(false);
      }
    }

    void loadFilters();
  }, []);

  useEffect(() => {
    async function loadVenues() {
      if (!cityIds.length) {
        setFilteredVenues(filters.venues);
        return;
      }

      const venues = await getVenuesByCities(cityIds);
      setFilteredVenues(venues);
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

  function updateParams(
    updates: Record<string, string | string[] | null>,
    resetPage = true,
  ) {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      next.delete(key);

      if (value === null) return;

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item) {
            next.append(key, item);
          }
        });
        return;
      }

      if (value) {
        next.set(key, value);
      }
    });

    if (resetPage) {
      next.set("page", "0");
    }

    if (!next.get("date")) {
      next.set("date", todayIsoDate);
    }

    setSearchParams(next, { preventScrollReset: true });
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParams({ query: searchValue || null });
  }

  function handleSingleSelectParam(key: string, value: string) {
    updateParams({ [key]: value ? [value] : null });
  }

  function handleDateSelect(date: string) {
    updateParams({ date });
  }

  function handleLoadMore() {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page + 1));
    setSearchParams(next, { preventScrollReset: true });
  }

  const selectedCity = cityIds[0] ?? "";
  const selectedVenue = venueIds[0] ?? "";
  const selectedGenre = genreIds[0] ?? "";
  const selectedProjectionTime = projectionTimes[0] ?? "";

  const visibleCount = useMemo(() => {
    if (!pageResponse) return 0;
    return getVisibleMovieCount(page, pageResponse.totalElements);
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
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search Movies"
              className="h-12 w-full rounded-lg border border-border-default bg-white pr-4 pl-11 text-[16px] leading-6 tracking-[0.005em] text-page-muted shadow-page-input outline-none"
            />
          </div>
        </form>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            value={selectedCity}
            onChange={(value) => {
              updateParams({
                cityIds: value ? [value] : null,
                venueIds: null,
                projectionTimes: null,
              });
            }}
            options={filters.cities}
            placeholder="All Cities"
            icon={<LocationPinIcon />}
            disabled={isFiltersLoading}
          />

          <FilterSelect
            value={selectedVenue}
            onChange={(value) => {
              updateParams({
                venueIds: value ? [value] : null,
                projectionTimes: null,
              });
            }}
            options={filteredVenues}
            placeholder="All Cinemas"
            icon={<CinemaIcon />}
            disabled={isFiltersLoading}
          />

          <FilterSelect
            value={selectedGenre}
            onChange={(value) => handleSingleSelectParam("genreIds", value)}
            options={filters.genres}
            placeholder="All Genres"
            icon={<GenresIcon />}
            disabled={isFiltersLoading}
          />

          <FilterSelect
            value={selectedProjectionTime}
            onChange={(value) =>
              handleSingleSelectParam("projectionTimes", value)
            }
            options={availableProjectionTimes}
            placeholder="All Projection Times"
            icon={<ClockIcon />}
            disabled={!selectedVenue}
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
            <div className="rounded-3xl border border-border-default bg-white px-6 py-20 text-center shadow-page-input">
              <p className="text-[16px] leading-6 text-page-muted">
                Loading currently showing movies...
              </p>
            </div>
          ) : isError ? (
            <div className="rounded-3xl border border-border-default bg-white px-6 py-20 text-center shadow-page-input">
              <p className="text-[16px] leading-6 text-page-muted">
                Something went wrong while loading currently showing movies.
              </p>
            </div>
          ) : movies.length === 0 ? (
            <CurrentlyShowingEmptyState hasActiveFilters={hasActiveFilters} />
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
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-lg bg-white px-5 text-[16px] leading-6 tracking-[0.005em] font-semibold text-brand-red underline transition-colors hover:bg-brand-red hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
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
