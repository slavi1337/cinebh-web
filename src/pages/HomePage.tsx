import { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import MovieCard from "@/components/home/MovieCard";
import PaginatedSection from "@/components/home/PaginatedSection";
import VenueCard from "@/components/home/VenueCard";
import VenuesMarquee from "@/components/home/VenuesMarquee";
import {
  getCurrentlyShowingMovies,
  getHeroMovies,
  getUpcomingMovies,
} from "@/services/movieService";
import { getVenues } from "@/services/venueService";
import type { PageResponse } from "@/types/common";
import type { HeroMovie, MovieCardItem, VenueCardItem } from "@/types/homepage";

export default function HomePage() {
  const [heroMovies, setHeroMovies] = useState<HeroMovie[]>([]);
  const [currentlyShowing, setCurrentlyShowing] =
    useState<PageResponse<MovieCardItem> | null>(null);
  const [upcomingMovies, setUpcomingMovies] =
    useState<PageResponse<MovieCardItem> | null>(null);
  const [venues, setVenues] = useState<PageResponse<VenueCardItem> | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchHomepageData() {
      try {
        setIsLoading(true);
        setIsError(false);

        const [heroData, currentlyShowingData, upcomingData, venuesData] =
          await Promise.all([
            getHeroMovies(),
            getCurrentlyShowingMovies(0, 10),
            getUpcomingMovies(0, 10),
            getVenues(0, 10),
          ]);

        setHeroMovies(heroData);
        setCurrentlyShowing(currentlyShowingData);
        setUpcomingMovies(upcomingData);
        setVenues(venuesData);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHomepageData();
  }, []);

  const statusMessage = isLoading
    ? "Loading homepage..."
    : "Something went wrong while loading the homepage.";

  if (isLoading || isError || !currentlyShowing || !upcomingMovies || !venues) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-page-background px-4">
        <p className="text-center text-[18px] leading-7 text-pricing-heading-text">
          {statusMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-page-background">
      <HeroSection movies={heroMovies} />
      <VenuesMarquee venues={venues.items} />

      <PaginatedSection
        title="Currently Showing"
        seeAllTo="/currently-showing"
        items={currentlyShowing.items}
        itemsPerPage={4}
        getItemKey={(movie) => movie.id}
        renderItem={(movie) => <MovieCard movie={movie} />}
      />

      <PaginatedSection
        title="Upcoming Movies"
        seeAllTo="/upcoming"
        items={upcomingMovies.items}
        itemsPerPage={4}
        getItemKey={(movie) => movie.id}
        renderItem={(movie) => <MovieCard movie={movie} />}
      />

      <PaginatedSection
        title="Venues"
        seeAllTo="/venues"
        items={venues.items}
        itemsPerPage={4}
        getItemKey={(venue) => venue.id}
        renderItem={(venue) => <VenueCard venue={venue} />}
      />
    </div>
  );
}
