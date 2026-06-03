import { useEffect, useMemo, useState } from "react";
import FilterSelect from "@/components/common/FilterSelect";
import ContentEmptyState from "@/components/common/ContentEmptyState";
import PageStatusCard from "@/components/common/PageStatusCard";
import UpcomingMovieCard from "@/components/upcoming-movies/UpcomingMovieCard";
import DateRangeFilter from "@/components/upcoming-movies/DateRangeFilter";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import LocationPinIcon from "@/components/ui/icons/LocationPinIcon";
import CinemaIcon from "@/components/ui/icons/CinemaIcon";
import GenresIcon from "@/components/ui/icons/GenresIcon";
import useListingSearchParams from "@/hooks/useListingSearchParams";
import {
  getUpcomingMovies,
  getUpcomingMoviesFilters,
  getUpcomingVenuesByCities,
} from "@/services/upcomingMoviesService";
import type { FilterOption, PageResponse } from "@/types/common";
import type { UpcomingMovie } from "@/types/upcomingMovies";
import { getVisibleItemCount } from "@/utils/pagination";
import { MOVIE_SEARCH_MAX_LENGTH } from "@/constants/search";

const PAGE_SIZE = 12;

export default function UpcomingMoviesPage() {
  const {
    searchParams,
    query,
    page,
    getArrayParam,
    updateParams,
    setNextPage,
  } = useListingSearchParams();

  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  const cityIds = useMemo(() => getArrayParam("cityIds"), [getArrayParam]);
  const venueIds = useMemo(() => getArrayParam("venueIds"), [getArrayParam]);
  const genreIds = useMemo(() => getArrayParam("genreIds"), [getArrayParam]);

  const [searchValue, setSearchValue] = useState(query);
  const [movies, setMovies] = useState<UpcomingMovie[]>([]);
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
    useState<PageResponse<UpcomingMovie> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltersLoading, setIsFiltersLoading] = useState(true);
  const [isFiltersError, setIsFiltersError] = useState(false);
  const [isError, setIsError] = useState(false);

  const hasNonDateFilters = Boolean(
    query || cityIds.length || venueIds.length || genreIds.length,
  );

  const emptyStateTitle = hasNonDateFilters
    ? "No movies found for selected filters"
    : "No movies to preview for current date range";

  const emptyStateDescription = hasNonDateFilters
    ? "Try adjusting your search or filters to explore available upcoming movies."
    : "We are working on updating our schedule for upcoming movies. Stay tuned for amazing movie experience or explore our other exciting cinema features in the meantime!";

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    async function loadFilters() {
      try {
        setIsFiltersLoading(true);
        setIsFiltersError(false);

        const response = await getUpcomingMoviesFilters();
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

        const venues = await getUpcomingVenuesByCities(cityIds);
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

        const response = await getUpcomingMovies({
          query: query || undefined,
          cityIds,
          venueIds,
          genreIds,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
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
  }, [query, cityIds, venueIds, genreIds, startDate, endDate, page]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedSearchValue = searchValue.trim();

    updateParams({ query: normalizedSearchValue || null });
  }

  function handleSingleSelectParam(key: string, value: string) {
    updateParams({ [key]: value ? [value] : null });
  }

  function handleVenueSelect(value: string) {
    const updates: Record<string, string | string[] | null> = {
      venueIds: value ? [value] : null,
    };

    if (value) {
      const selectedVenueOption =
        filteredVenues.find((venue) => venue.id === value) ??
        filters.venues.find((venue) => venue.id === value);

      if (selectedVenueOption?.cityId) {
        updates.cityIds = [selectedVenueOption.cityId];
      }
    }

    updateParams(updates);
  }

  const selectedCity = cityIds[0] ?? "";
  const selectedVenue = venueIds[0] ?? "";
  const selectedGenre = genreIds[0] ?? "";

  const visibleCount = useMemo(() => {
    if (!pageResponse) return 0;
    return getVisibleItemCount(page, pageResponse.totalElements, PAGE_SIZE);
  }, [page, pageResponse]);

  const hasMore = pageResponse !== null && page < pageResponse.totalPages - 1;

  return (
    <div className="min-h-screen bg-page-background">
      <div className="mx-auto w-full max-w-360 px-4 pt-12 pb-20 md:px-8 lg:px-23">
        <h1 className="text-[32px] leading-10 tracking-[-0.0025em] font-bold text-page-heading">
          Upcoming Movies{visibleCount > 0 ? ` (${visibleCount})` : ""}
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
              updateParams({
                cityIds: value ? [value] : null,
                venueIds: null,
              });
            }}
            options={filters.cities}
            placeholder="All Cities"
            icon={<LocationPinIcon />}
            disabled={isFiltersLoading || isFiltersError}
          />

          <FilterSelect
            value={selectedVenue}
            onChange={handleVenueSelect}
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

          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onChange={(nextStartDate, nextEndDate) =>
              updateParams({
                startDate: nextStartDate,
                endDate: nextEndDate,
              })
            }
            disabled={isFiltersLoading || isFiltersError}
          />
        </div>

        <div className="mt-8">
          {isLoading ? (
            <PageStatusCard label="Loading upcoming movies..." />
          ) : isError ? (
            <PageStatusCard label="Something went wrong while loading upcoming movies." />
          ) : movies.length === 0 ? (
            <ContentEmptyState
              title={emptyStateTitle}
              description={emptyStateDescription}
            />
          ) : (
            <>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {movies.map((movie) => (
                  <UpcomingMovieCard key={movie.movieId} movie={movie} />
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
