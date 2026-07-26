import axios from "axios";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import BookingSummary from "@/components/booking/BookingSummary";
import SeatGrid from "@/components/booking/SeatGrid";
import SessionTimer from "@/components/booking/SessionTimer";
import PageStatusCard from "@/components/common/PageStatusCard";
import moviePosterPlaceholder from "@/assets/movie-poster-placeholder.svg";
import { EXPIRED_PROJECTION_MESSAGE } from "@/constants/bookingMessages";
import { useAuth } from "@/context/AuthContext";
import {
  cancelBookingHold,
  createCheckoutSession,
  getProjectionSeatWebSocketUrl,
  getProjectionSeatMap,
  holdBookingSeats,
  reserveBookingHold,
} from "@/services/bookingService";
import type {
  BookingHold,
  BookingMode,
  Seat,
  SeatMap,
  SelectedSeat,
} from "@/types/booking";
import { getApiErrorMessage } from "@/utils/auth";
import { saveBookingIntent } from "@/utils/bookingIntent";
import { isDateTimePassed } from "@/utils/projectionTime";

function formatProjectionDateTime(value: string) {
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

function formatDuration(durationMinutes: number | null) {
  return durationMinutes ? `${durationMinutes} Min` : null;
}

function formatMovieMeta(seatMap: SeatMap) {
  return [
    seatMap.pgRating,
    seatMap.language,
    formatDuration(seatMap.durationMinutes),
  ].filter(Boolean);
}

function getMode(value: string | null): BookingMode {
  return value === "reserve" ? "reserve" : "buy";
}

function getSelectedSeatsFromMap(
  seatMap: SeatMap | null,
  selectedSeatIds: Set<string>,
): SelectedSeat[] {
  if (!seatMap) {
    return [];
  }

  return seatMap.seats
    .filter((seat) => selectedSeatIds.has(seat.id))
    .map((seat) => ({
      id: seat.id,
      row: seat.row,
      number: seat.number,
      type: seat.type,
      price: seat.price,
    }));
}

type ProjectionSeatWebSocketEvent = {
  type: "SEAT_MAP_CHANGED";
  projectionId: string;
};

function SeatSelectionPageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-page-background">
      <div className="mx-auto w-full max-w-360 px-4 pb-20 md:px-8 lg:px-23">
        {children}
      </div>
    </main>
  );
}

function SeatSessionTimer({
  expiresAt,
  onExpired,
}: {
  expiresAt?: string;
  onExpired: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="group relative flex items-center gap-1 text-body-md text-page-heading">
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-page-muted text-[10px] font-bold text-page-muted">
          i
        </span>
        Session Duration
        <span className="pointer-events-none absolute top-8 right-0 z-10 w-52 rounded-lg bg-page-heading px-4 py-3 text-center text-[12px] leading-4 text-white opacity-0 shadow-movie-card transition-opacity group-hover:opacity-100">
          The session timer starts after you select your first seat.
        </span>
      </span>
      {expiresAt ? (
        <SessionTimer
          expiresAt={expiresAt}
          showLabel={false}
          className="rounded-lg border border-border-default bg-white px-3 py-2 text-center text-page-heading shadow-page-input"
          timeClassName="text-[18px] leading-6 font-bold tabular-nums"
          onExpired={onExpired}
        />
      ) : (
        <div className="rounded-lg border border-border-default bg-white px-3 py-2 text-center text-page-heading shadow-page-input">
          <p className="text-[14px] leading-6 font-semibold">Not started</p>
        </div>
      )}
    </div>
  );
}

function MovieMetaList({ seatMap }: { seatMap: SeatMap }) {
  const metaItems = formatMovieMeta(seatMap);

  if (metaItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-md text-page-muted">
      {metaItems.map((item, index) => (
        <span key={item} className="flex items-center gap-3">
          {index > 0 ? <span className="h-5 w-px bg-brand-red" /> : null}
          {item}
        </span>
      ))}
    </div>
  );
}

function SessionExpiredModal({
  isUpdating,
  onConfirm,
}: {
  isUpdating: boolean;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-auth-overlay px-4 pt-30">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
        className="w-full max-w-100 rounded-2xl bg-white px-7 py-6 shadow-movie-card"
      >
        <h2
          id="session-expired-title"
          className="text-[20px] leading-6 font-bold text-page-heading"
        >
          Session Expired
        </h2>
        <p className="mt-3 text-[14px] leading-5 text-page-muted">
          Your session expired and seats have been refreshed and updated.
        </p>
        <div className="mt-7 flex justify-end">
          <button
            type="button"
            disabled={isUpdating}
            onClick={onConfirm}
            className="h-10 rounded-lg bg-brand-red px-5 text-[14px] leading-5 font-semibold text-white transition enabled:cursor-pointer enabled:hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:bg-movie-details-border"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SeatSelectionPage() {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, openSignIn, showToast } = useAuth();
  const projectionId = searchParams.get("projectionId") ?? "";
  const mode = getMode(searchParams.get("mode"));
  const paymentStatus = searchParams.get("payment");
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [hold, setHold] = useState<BookingHold | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const hasRequestedAuthRef = useRef(false);

  const loadSeatMap = useCallback(async (showLoading = true) => {
    if (!projectionId) {
      setErrorMessage("Projection was not selected.");
      setIsLoading(false);
      return;
    }

    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setErrorMessage("");
      const response = await getProjectionSeatMap(projectionId);

      if (isDateTimePassed(response.startTime)) {
        setSeatMap(null);
        setHold(null);
        setSelectedSeatIds(new Set());
        setErrorMessage(EXPIRED_PROJECTION_MESSAGE);
        return;
      }

      setSeatMap(response);
      setHold(response.activeHold);
      setSelectedSeatIds(
        new Set(response.activeHold?.seats.map((seat) => seat.id) ?? []),
      );
      setIsSessionExpired(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        if (movieId) {
          saveBookingIntent({ movieId, projectionId, mode });
        }
        openSignIn();
        return;
      }

      setErrorMessage("Seat map could not be loaded.");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [mode, movieId, openSignIn, projectionId]);

  useEffect(() => {
    if (!currentUser) {
      if (!hasRequestedAuthRef.current && movieId && projectionId) {
        hasRequestedAuthRef.current = true;
        saveBookingIntent({ movieId, projectionId, mode });
        openSignIn();
      }

      setIsLoading(false);
      return;
    }

    void loadSeatMap();
  }, [currentUser, loadSeatMap, mode, movieId, openSignIn, projectionId]);

  useEffect(() => {
    if (paymentStatus !== "cancelled") {
      return;
    }

    showToast(
      "Payment was cancelled. Your seat hold is still active until the timer expires.",
      "error",
    );

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

  useEffect(() => {
    if (!currentUser || !projectionId) {
      return undefined;
    }

    let socket: WebSocket | null = null;
    let reconnectTimeoutId: number | null = null;
    let isActive = true;

    function refreshSeatMap(event: MessageEvent<string>) {
      try {
        const payload = JSON.parse(event.data) as ProjectionSeatWebSocketEvent;

        if (
          payload.type !== "SEAT_MAP_CHANGED" ||
          payload.projectionId !== projectionId
        ) {
          return;
        }
      } catch {
        return;
      }

      void loadSeatMap(false);
    }

    function connect() {
      socket = new WebSocket(getProjectionSeatWebSocketUrl(projectionId));
      socket.onmessage = refreshSeatMap;
      socket.onerror = () => socket?.close();
      socket.onclose = () => {
        if (!isActive) {
          return;
        }

        reconnectTimeoutId = window.setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      isActive = false;

      if (reconnectTimeoutId) {
        window.clearTimeout(reconnectTimeoutId);
      }

      socket?.close();
    };
  }, [currentUser, loadSeatMap, projectionId]);

  const selectedSeats = useMemo(() => {
    if (hold) {
      return hold.seats;
    }

    return getSelectedSeatsFromMap(seatMap, selectedSeatIds);
  }, [hold, seatMap, selectedSeatIds]);

  const totalPrice = useMemo(() => {
    return hold
      ? hold.totalPrice
      : selectedSeats.reduce((total, seat) => total + seat.price, 0);
  }, [hold, selectedSeats]);

  async function handleToggleSeat(seat: Seat) {
    if (
      !projectionId ||
      isUpdating ||
      isSessionExpired ||
      (seat.status !== "AVAILABLE" && !selectedSeatIds.has(seat.id))
    ) {
      return;
    }

    const nextSelectedSeatIds = new Set(selectedSeatIds);

    if (nextSelectedSeatIds.has(seat.id)) {
      nextSelectedSeatIds.delete(seat.id);
    } else {
      nextSelectedSeatIds.add(seat.id);
    }

    try {
      setIsUpdating(true);

      if (nextSelectedSeatIds.size === 0) {
        if (hold) {
          await cancelBookingHold(hold.bookingId);
        }

        setHold(null);
        setSelectedSeatIds(new Set());
        await loadSeatMap(false);
        return;
      }

      const response = await holdBookingSeats({
        projectionId,
        seatTemplateIds: Array.from(nextSelectedSeatIds),
      });

      setHold(response);
      setSelectedSeatIds(
        new Set(response.seats.map((selectedSeat) => selectedSeat.id)),
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        showToast("That seat is no longer available.", "error");
        await loadSeatMap(false);
        return;
      }

      showToast("Selected seats could not be updated.", "error");
    } finally {
      setIsUpdating(false);
    }
  }

  const handleSessionExpired = useCallback(() => {
    setIsSessionExpired(true);
    setHold(null);
    setSelectedSeatIds(new Set());
  }, []);

  async function handleStartNewSession() {
    setIsSessionExpired(false);
    await loadSeatMap(false);
  }

  async function handleCancelHold() {
    if (!hold) {
      navigate(movieId ? `/movies/${movieId}` : "/currently-showing");
      return;
    }

    try {
      setIsUpdating(true);
      await cancelBookingHold(hold.bookingId);
      navigate(movieId ? `/movies/${movieId}` : "/currently-showing");
    } catch {
      showToast("Seat selection session could not be cancelled.", "error");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleNextPhaseAction() {
    if (!hold || selectedSeats.length === 0) {
      showToast("Select at least one seat before continuing.", "error");
      return;
    }

    if (mode === "reserve") {
      try {
        setIsUpdating(true);
        await reserveBookingHold(hold.bookingId);
        showToast("Reservation created successfully.");
        navigate("/profile/reservations");
      } catch (error) {
        showToast(getApiErrorMessage(error), "error");
        await loadSeatMap(false);
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    try {
      setIsUpdating(true);
      const response = await createCheckoutSession({
        bookingId: hold.bookingId,
      });

      if (!response.sessionUrl) {
        showToast("Checkout session URL was not returned.", "error");
        return;
      }

      window.location.assign(response.sessionUrl);
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
      await loadSeatMap(false);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <SeatSelectionPageLayout>
        <PageStatusCard label="Loading seat map..." />
      </SeatSelectionPageLayout>
    );
  }

  if (errorMessage || !seatMap) {
    return (
      <SeatSelectionPageLayout>
        <PageStatusCard label={errorMessage || "Seat map was not found."} />
      </SeatSelectionPageLayout>
    );
  }

  return (
    <SeatSelectionPageLayout>
      <section className="relative flex flex-col gap-4 border-b border-movie-details-border py-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[24px] leading-8 font-bold tracking-[-0.0015em] text-page-heading">
          Seat Options
        </h1>
        <SeatSessionTimer
          expiresAt={hold?.expiresAt}
          onExpired={handleSessionExpired}
        />
        <span className="absolute bottom-[-1px] left-0 h-px w-full max-w-150 bg-brand-red" />
      </section>

      <section className="border-b border-movie-details-border py-6">
        <div className="grid gap-5 md:grid-cols-[116px_minmax(0,0.6fr)_minmax(260px,1fr)] md:items-start">
          <img
            src={seatMap.posterImageUrl || moviePosterPlaceholder}
            alt={seatMap.movieTitle}
            className="h-28 w-28 rounded-2xl object-cover"
          />
          <div>
            <h2 className="text-[20px] leading-6 font-bold tracking-[-0.0015em] text-page-heading">
              {seatMap.movieTitle}
            </h2>
            <MovieMetaList seatMap={seatMap} />
          </div>
          <div>
            <h2 className="text-[20px] leading-6 font-bold tracking-[-0.0015em] text-page-heading">
              Booking Details
            </h2>
            <p className="mt-4 text-body-md text-page-heading">
              {formatProjectionDateTime(seatMap.startTime)}
            </p>
            <p className="mt-3 text-body-md text-page-heading">
              {seatMap.venueName}, {seatMap.cityName}
            </p>
            <p className="mt-3 text-body-md text-page-heading">
              {seatMap.hallName}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-12 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)] lg:items-start">
        <SeatGrid
          seats={seatMap.seats}
          selectedSeatIds={selectedSeatIds}
          isUpdating={isUpdating || isSessionExpired}
          onToggleSeat={handleToggleSeat}
        />
        <BookingSummary
          seats={selectedSeats}
          allSeats={seatMap.seats}
          totalPrice={totalPrice}
          actionLabel={
            mode === "reserve"
              ? "Make Reservation"
              : "Continue to Payment"
          }
          isActionDisabled={selectedSeats.length === 0 || isSessionExpired}
          isUpdating={isUpdating}
          onAction={handleNextPhaseAction}
        />
      </div>

      {isSessionExpired ? (
        <SessionExpiredModal
          isUpdating={isUpdating}
          onConfirm={() => void handleStartNewSession()}
        />
      ) : null}

      <div className="pt-2">
        <button
          type="button"
          onClick={handleCancelHold}
          className="text-body-md font-semibold text-brand-red"
        >
          Back to Movie Details
        </button>
      </div>
    </SeatSelectionPageLayout>
  );
}
