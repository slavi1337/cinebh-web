import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageStatusCard from "@/components/common/PageStatusCard";
import MovieInfoPanel from "@/components/movie-details/MovieInfoPanel";
import MovieMediaGallery from "@/components/movie-details/MovieMediaGallery";
import MovieScheduleCard from "@/components/movie-details/MovieScheduleCard";
import MovieSeeAlsoSection from "@/components/movie-details/MovieSeeAlsoSection";
import UpcomingNotifyCard from "@/components/movie-details/UpcomingNotifyCard";
import { useAuth } from "@/context/AuthContext";
import {
  getMovieDetails,
  getMovieProjections,
} from "@/services/movieDetailsService";
import type { MovieDetails, MovieProjection } from "@/types/movieDetails";
function isMovieUpcoming(movie: MovieDetails) {
  if (!movie.releaseDate) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const releaseDate = new Date(`${movie.releaseDate}T00:00:00`);
  releaseDate.setHours(0, 0, 0, 0);
  return releaseDate > today;
}
export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const { currentUser, openSignIn, openSignUp, showToast } = useAuth();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [projections, setProjections] = useState<MovieProjection[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [selectedProjectionId, setSelectedProjectionId] = useState("");
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  const [isLoadingProjections, setIsLoadingProjections] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isUpcoming = useMemo(() => {
    return movie ? isMovieUpcoming(movie) : false;
  }, [movie]);
  const availableVenues = useMemo(() => {
    if (!movie) {
      return [];
    }
    if (!selectedCityId) {
      return movie.venues;
    }
    return movie.venues.filter((venue) => venue.cityId === selectedCityId);
  }, [movie, selectedCityId]);
  useEffect(() => {
    async function loadMovieDetails() {
      if (!movieId) {
        setErrorMessage("Movie was not found.");
        setIsLoadingMovie(false);
        return;
      }
      try {
        setIsLoadingMovie(true);
        setErrorMessage("");
        const movieDetails = await getMovieDetails(movieId);
        setMovie(movieDetails);
        setSelectedDate(movieDetails.projectionDates[0] ?? "");
        setSelectedCityId("");
        setSelectedVenueId("");
        setSelectedProjectionId("");
      } catch {
        setErrorMessage("Movie details could not be loaded.");
      } finally {
        setIsLoadingMovie(false);
      }
    }
    void loadMovieDetails();
  }, [movieId]);
  useEffect(() => {
    async function loadProjections() {
      if (!movieId || !movie || isUpcoming || !selectedDate) {
        setProjections([]);
        return;
      }
      try {
        setIsLoadingProjections(true);
        const result = await getMovieProjections(movieId, {
          date: selectedDate,
          cityIds: selectedCityId ? [selectedCityId] : undefined,
          venueIds: selectedVenueId ? [selectedVenueId] : undefined,
        });
        setProjections(result);
        setSelectedProjectionId((currentProjectionId) => {
          const stillExists = result.some(
            (projection) => projection.projectionId === currentProjectionId,
          );
          return stillExists ? currentProjectionId : "";
        });
      } catch {
        setProjections([]);
        showToast("Projection times could not be loaded.", "error");
      } finally {
        setIsLoadingProjections(false);
      }
    }
    void loadProjections();
  }, [
    isUpcoming,
    movie,
    movieId,
    selectedCityId,
    selectedDate,
    selectedVenueId,
    showToast,
  ]);
  function handleAuthRequired() {
    openSignIn();
  }
  function handleSignUpRequired() {
    openSignUp();
  }
  if (isLoadingMovie) {
    return (
      <main className="min-h-screen bg-page-background">
        <div className="mx-auto w-full max-w-360 px-4 pt-12 pb-20 md:px-8 lg:px-23">
          <PageStatusCard label="Loading movie details..." />
        </div>
      </main>
    );
  }
  if (errorMessage || !movie) {
    return (
      <main className="min-h-screen bg-page-background">
        <div className="mx-auto w-full max-w-360 px-4 pt-12 pb-20 md:px-8 lg:px-23">
          <PageStatusCard label={errorMessage || "Movie was not found."} />
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-page-background">
      <div className="mx-auto w-full max-w-360 px-4 pt-12 pb-20 md:px-8 lg:px-23">
        <h1 className="text-[24px] leading-8 font-bold tracking-[-0.0015em] text-movie-details-heading">
          Movie Details
        </h1>
        <MovieMediaGallery
          title={movie.title}
          trailerUrl={movie.trailerUrl}
          coverImageUrl={movie.coverImageUrl}
          previewImageUrls={movie.previewImageUrls}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)] lg:items-start">
          <MovieInfoPanel movie={movie} isUpcoming={isUpcoming} />
          <div>
            {isUpcoming ? (
              <UpcomingNotifyCard
                movie={movie}
                isAuthenticated={Boolean(currentUser)}
                onSignIn={handleAuthRequired}
                onSignUp={handleSignUpRequired}
              />
            ) : (
              <>
                <MovieScheduleCard
                  movie={movie}
                  availableVenues={availableVenues}
                  selectedDate={selectedDate}
                  selectedCityId={selectedCityId}
                  selectedVenueId={selectedVenueId}
                  selectedProjectionId={selectedProjectionId}
                  projections={projections}
                  isAuthenticated={Boolean(currentUser)}
                  onDateChange={setSelectedDate}
                  onCityChange={(cityId) => {
                    setSelectedCityId(cityId);
                    setSelectedVenueId("");
                    setSelectedProjectionId("");
                  }}
                  onVenueChange={(venueId) => {
                    setSelectedVenueId(venueId);
                    setSelectedProjectionId("");
                  }}
                  onProjectionChange={setSelectedProjectionId}
                  onAuthRequired={handleAuthRequired}
                />
                {isLoadingProjections && (
                  <p className="mt-4 text-body-md text-page-muted">
                    Loading projection times...
                  </p>
                )}
                {currentUser && (
                  <p className="mt-4 text-body-md text-page-muted">
                    Seat selection and checkout will be available in the next
                    ticket.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        <MovieSeeAlsoSection movies={movie.seeAlso} isUpcoming={isUpcoming} />
      </div>
    </main>
  );
}
