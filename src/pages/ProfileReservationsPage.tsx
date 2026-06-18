import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SessionTimer from "@/components/booking/SessionTimer";
import PageStatusCard from "@/components/common/PageStatusCard";
import ProfileBookingDetails from "@/components/profile/ProfileBookingDetails";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProfileMoviePosterLink from "@/components/profile/ProfileMoviePosterLink";
import ProfileSeatDetails from "@/components/profile/ProfileSeatDetails";
import { useAuth } from "@/context/AuthContext";
import {
  cancelReservation,
  createCheckoutSession,
  getReservations,
} from "@/services/bookingService";
import type { Reservation } from "@/types/booking";
import { getApiErrorMessage } from "@/utils/auth";

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
        <h2 className="text-[18px] leading-6 font-bold tracking-[-0.0015em] text-page-heading">
          {reservation.movieTitle}
        </h2>
        <ReservationTimer reservation={reservation} onExpired={onExpired} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[116px_minmax(0,1fr)_minmax(220px,0.7fr)_160px] lg:items-start">
        <ProfileMoviePosterLink
          movieId={reservation.movieId}
          movieTitle={reservation.movieTitle}
          posterImageUrl={reservation.posterImageUrl}
        />
        <ProfileBookingDetails
          startTime={reservation.projectionStartTime}
          venueName={reservation.venueName}
          cityName={reservation.cityName}
          pgRating={reservation.pgRating}
          language={reservation.language}
          durationMinutes={reservation.durationMinutes}
        />
        <ProfileSeatDetails
          title="Seat(s) Details"
          seats={reservation.seats}
          hallName={reservation.hallName}
          totalPrice={reservation.totalPrice}
        />

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

  const headerAction = (
    <Link
      to="/currently-showing"
      className="inline-flex h-11 items-center justify-center rounded-lg border border-border-default px-5 text-body-md font-semibold text-page-heading transition hover:border-brand-red hover:text-brand-red"
    >
      Browse Movies
    </Link>
  );

  if (isLoading) {
    return (
      <ProfileLayout
        title="Pending Reservations"
        reservationCount={reservations.length}
      >
        <PageStatusCard label="Loading reservations..." />
      </ProfileLayout>
    );
  }

  if (errorMessage) {
    return (
      <ProfileLayout
        title="Pending Reservations"
        reservationCount={reservations.length}
      >
        <PageStatusCard label={errorMessage} />
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout
      title="Pending Reservations"
      reservationCount={reservations.length}
      headerAction={headerAction}
    >
      {reservations.length === 0 ? (
        <PageStatusCard label="You do not have active reservations." />
      ) : (
        <div className="grid gap-5">
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
