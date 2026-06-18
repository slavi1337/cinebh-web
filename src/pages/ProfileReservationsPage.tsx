import axios from "axios";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SessionTimer from "@/components/booking/SessionTimer";
import PageStatusCard from "@/components/common/PageStatusCard";
import moviePosterPlaceholder from "@/assets/movie-poster-placeholder.svg";
import { useAuth } from "@/context/AuthContext";
import {
  cancelReservation,
  createCheckoutSession,
  getReservations,
} from "@/services/bookingService";
import type { Reservation, SelectedSeat } from "@/types/booking";
import { getApiErrorMessage } from "@/utils/auth";

type ProfileLayoutProps = {
  reservationCount: number;
  children: ReactNode;
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${dateLabel} at ${timeLabel}`;
}

function formatAmount(value: number) {
  return `${Number(value).toFixed(2)} BAM`;
}

function formatDuration(durationMinutes: number | null) {
  return durationMinutes ? `${durationMinutes} Min` : null;
}

function seatLabel(seat: SelectedSeat) {
  return `${seat.row}${seat.number}`;
}

function SidebarIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-current">
      {children}
    </span>
  );
}

function ProfileSidebar({ reservationCount }: { reservationCount: number }) {
  return (
    <aside className="bg-navbar-background px-4 py-6 text-white lg:min-h-[calc(100vh-80px)] lg:w-65 lg:px-8 lg:py-8">
      <h2 className="text-[24px] leading-8 font-bold tracking-[-0.0015em]">
        User Profile
      </h2>

      <nav className="mt-8 flex gap-6 overflow-x-auto pb-2 lg:block lg:space-y-7 lg:overflow-visible lg:pb-0">
        <div className="min-w-48 lg:min-w-0">
          <div className="mb-4 flex items-center gap-3 text-[12px] leading-4 text-auth-text-muted">
            <span>General</span>
            <span className="h-px flex-1 bg-navbar-border" />
          </div>
          <div className="space-y-4 text-body-md text-auth-text-muted">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <SidebarIcon>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5 6a5 5 0 0 0-10 0"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </SidebarIcon>
              Personal Information
            </span>
            <span className="flex items-center gap-2 whitespace-nowrap">
              <SidebarIcon>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M4 7V5a4 4 0 0 1 8 0v2m-8 0h8v7H4V7Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </SidebarIcon>
              Password
            </span>
          </div>
        </div>

        <div className="min-w-58 lg:min-w-0">
          <div className="mb-4 flex items-center gap-3 text-[12px] leading-4 text-auth-text-muted">
            <span>Movies</span>
            <span className="h-px flex-1 bg-navbar-border" />
          </div>
          <div className="space-y-4 text-body-md">
            <span className="flex items-center gap-2 whitespace-nowrap font-semibold text-white">
              <SidebarIcon>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle
                    cx="8"
                    cy="8"
                    r="5.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M8 4.5V8l2 1.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </SidebarIcon>
              Pending Reservations ({reservationCount})
            </span>
            <span className="flex items-center gap-2 whitespace-nowrap text-auth-text-muted">
              <SidebarIcon>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 4h10v9H3V4Zm0 3h10M6 4v9m4-9v9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </SidebarIcon>
              Projections
            </span>
          </div>
        </div>
      </nav>
    </aside>
  );
}

function ProfileLayout({ reservationCount, children }: ProfileLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-page-background">
      <div className="flex w-full flex-col lg:flex-row">
        <ProfileSidebar reservationCount={reservationCount} />
        <section className="min-w-0 flex-1 px-4 py-8 md:px-8 lg:px-8">
          <div className="mx-auto w-full max-w-[1120px]">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

function MovieMeta({ reservation }: { reservation: Reservation }) {
  const metaItems = [
    reservation.pgRating,
    reservation.language,
    formatDuration(reservation.durationMinutes),
  ].filter(Boolean);

  if (metaItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] leading-5 text-page-muted">
      {metaItems.map((item, index) => (
        <span key={item} className="flex items-center gap-3">
          {index > 0 ? <span className="h-5 w-px bg-brand-red" /> : null}
          {item}
        </span>
      ))}
    </div>
  );
}

function ReservationTimer({
  reservation,
  onExpired,
}: {
  reservation: Reservation;
  onExpired: (bookingId: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="group relative flex h-5 w-5 items-center justify-center rounded-full border border-page-muted text-[12px] font-bold text-page-muted">
        i
        <span className="pointer-events-none absolute right-0 bottom-7 z-10 w-60 rounded-lg bg-page-heading px-3 py-2 text-[11px] leading-4 font-normal text-white opacity-0 shadow-movie-card transition-opacity group-hover:opacity-100">
          Reservation expires one hour before projection.
        </span>
      </span>
      <SessionTimer
        expiresAt={reservation.expiresAt}
        showLabel={false}
        className="rounded-lg border border-border-default bg-white px-3 py-1 text-center text-page-heading shadow-page-input"
        timeClassName="text-[18px] leading-6 font-bold tabular-nums"
        onExpired={() => onExpired(reservation.bookingId)}
      />
    </div>
  );
}

type ReservationCardProps = {
  reservation: Reservation;
  isUpdating: boolean;
  onCheckout: (reservation: Reservation) => void;
  onCancelClick: (reservation: Reservation) => void;
  onExpired: (bookingId: string) => void;
};

function ReservationCard({
  reservation,
  isUpdating,
  onCheckout,
  onCancelClick,
  onExpired,
}: ReservationCardProps) {
  return (
    <article className="rounded-2xl border border-border-default bg-white p-4 shadow-page-input md:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <h2 className="text-[20px] leading-6 font-bold tracking-[-0.0015em] text-page-heading">
          {reservation.movieTitle}
        </h2>
        <ReservationTimer reservation={reservation} onExpired={onExpired} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[116px_minmax(0,1fr)_minmax(220px,0.7fr)_160px] lg:items-start">
        <Link
          to={`/movies/${reservation.movieId}`}
          className="block h-28 w-28 overflow-hidden rounded-2xl bg-movie-details-chip-background"
        >
          <img
            src={reservation.posterImageUrl || moviePosterPlaceholder}
            alt={reservation.movieTitle}
            className="h-full w-full object-cover"
          />
        </Link>

        <div>
          <h3 className="text-body-md font-bold text-page-muted">
            Booking Details
          </h3>
          <p className="mt-4 text-body-md text-page-heading">
            {formatDateTime(reservation.projectionStartTime)}
          </p>
          <p className="mt-4 text-body-md text-page-heading">
            {reservation.venueName}, {reservation.cityName}
          </p>
          <MovieMeta reservation={reservation} />
        </div>

        <div>
          <h3 className="text-body-md font-bold text-page-muted">
            Seat(s) Details
          </h3>
          <p className="mt-4 text-body-md text-page-heading">
            <span className="text-page-muted">Seat(s): </span>
            <span className="font-semibold">
              {reservation.seats.map(seatLabel).join(", ")}
            </span>
          </p>
          <p className="mt-4 text-body-md text-page-heading">
            <span className="text-page-muted">Hall: </span>
            <span className="font-semibold">{reservation.hallName}</span>
          </p>
          <p className="mt-4 text-body-md text-page-heading">
            <span className="text-page-muted">Total Price: </span>
            <span className="font-semibold">
              {formatAmount(reservation.totalPrice)}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:pt-1">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onCheckout(reservation)}
            className="h-12 rounded-lg bg-brand-red text-body-md font-semibold text-white transition enabled:cursor-pointer enabled:hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:bg-movie-details-border"
          >
            {isUpdating ? "Updating..." : "Buy Ticket"}
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onCancelClick(reservation)}
            className="h-12 rounded-lg border border-brand-red bg-white text-body-md font-semibold text-brand-red transition enabled:cursor-pointer enabled:hover:bg-brand-red/5 disabled:cursor-not-allowed disabled:border-movie-details-border disabled:text-page-muted"
          >
            Cancel Reservation
          </button>
        </div>
      </div>
    </article>
  );
}

type CancelReservationModalProps = {
  reservation: Reservation;
  isUpdating: boolean;
  onBack: () => void;
  onConfirm: () => void;
};

function CancelReservationModal({
  reservation,
  isUpdating,
  onBack,
  onConfirm,
}: CancelReservationModalProps) {
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-auth-overlay px-4 pt-30">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-reservation-title"
        className="w-full max-w-100 rounded-2xl bg-white px-7 py-6 shadow-movie-card"
      >
        <h2
          id="cancel-reservation-title"
          className="text-[20px] leading-6 font-bold text-page-heading"
        >
          Cancel Reservation
        </h2>
        <p className="mt-3 text-[14px] leading-5 text-page-muted">
          Do you want to cancel your reservation for {reservation.movieTitle}?
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            disabled={isUpdating}
            onClick={onBack}
            className="h-10 rounded-lg border border-brand-red px-5 text-[14px] leading-5 font-semibold text-brand-red transition enabled:cursor-pointer enabled:hover:bg-brand-red/5 disabled:cursor-not-allowed disabled:border-movie-details-border disabled:text-page-muted"
          >
            Back
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={onConfirm}
            className="h-10 rounded-lg bg-brand-red px-5 text-[14px] leading-5 font-semibold text-white transition enabled:cursor-pointer enabled:hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:bg-movie-details-border"
          >
            {isUpdating ? "Cancelling..." : "Yes, Cancel It"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileReservationsPage() {
  const { currentUser, openSignIn, showToast } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const paymentStatus = searchParams.get("payment");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] = useState("");
  const [reservationToCancel, setReservationToCancel] =
    useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const loadReservations = useCallback(async () => {
    if (!currentUser) {
      setIsLoading(false);
      setErrorMessage("Sign in to view your reservations.");
      openSignIn();
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setReservations(await getReservations());
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        openSignIn();
        setErrorMessage("Sign in to view your reservations.");
        return;
      }

      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, openSignIn]);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  useEffect(() => {
    if (paymentStatus !== "cancelled") {
      return;
    }

    showToast("Payment was cancelled. Your reservation is still active.", "error");

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("payment");
    navigate(
      {
        pathname: location.pathname,
        search: nextSearchParams.toString(),
      },
      { replace: true },
    );
  }, [location.pathname, navigate, paymentStatus, searchParams, showToast]);

  async function handleCheckout(reservation: Reservation) {
    try {
      setUpdatingBookingId(reservation.bookingId);
      const response = await createCheckoutSession({
        bookingId: reservation.bookingId,
      });

      if (!response.sessionUrl) {
        showToast("Checkout session URL was not returned.", "error");
        return;
      }

      window.location.assign(response.sessionUrl);
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
      await loadReservations();
    } finally {
      setUpdatingBookingId("");
    }
  }

  async function handleCancel(reservation: Reservation) {
    try {
      setUpdatingBookingId(reservation.bookingId);
      await cancelReservation(reservation.bookingId);
      setReservations((currentReservations) =>
        currentReservations.filter(
          (item) => item.bookingId !== reservation.bookingId,
        ),
      );
      setReservationToCancel(null);
      showToast("Reservation cancelled successfully.");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
      await loadReservations();
    } finally {
      setUpdatingBookingId("");
    }
  }

  function handleReservationExpired(bookingId: string) {
    setReservations((currentReservations) =>
      currentReservations.filter(
        (reservation) => reservation.bookingId !== bookingId,
      ),
    );
  }

  if (isLoading) {
    return (
      <ProfileLayout reservationCount={reservations.length}>
        <PageStatusCard label="Loading reservations..." />
      </ProfileLayout>
    );
  }

  if (errorMessage) {
    return (
      <ProfileLayout reservationCount={reservations.length}>
        <PageStatusCard label={errorMessage} />
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout reservationCount={reservations.length}>
      <div className="flex flex-col gap-3 border-b border-border-default pb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[24px] leading-8 font-bold tracking-[-0.0015em] text-page-heading">
          Pending Reservations
        </h1>
        <Link
          to="/currently-showing"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-border-default px-5 text-body-md font-semibold text-page-heading transition hover:border-brand-red hover:text-brand-red"
        >
          Browse Movies
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="mt-6">
          <PageStatusCard label="You do not have active reservations." />
        </div>
      ) : (
        <div className="mt-6 grid gap-5">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.bookingId}
              reservation={reservation}
              isUpdating={updatingBookingId === reservation.bookingId}
              onCheckout={(selectedReservation) =>
                void handleCheckout(selectedReservation)
              }
              onCancelClick={setReservationToCancel}
              onExpired={handleReservationExpired}
            />
          ))}
        </div>
      )}

      {reservationToCancel ? (
        <CancelReservationModal
          reservation={reservationToCancel}
          isUpdating={updatingBookingId === reservationToCancel.bookingId}
          onBack={() => setReservationToCancel(null)}
          onConfirm={() => void handleCancel(reservationToCancel)}
        />
      ) : null}
    </ProfileLayout>
  );
}
