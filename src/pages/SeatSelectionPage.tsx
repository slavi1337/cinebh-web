import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BookingSummary from "@/components/booking/BookingSummary";
import SeatGrid from "@/components/booking/SeatGrid";
import SessionTimer from "@/components/booking/SessionTimer";
import PageStatusCard from "@/components/common/PageStatusCard";
import { EXPIRED_PROJECTION_MESSAGE } from "@/constants/bookingMessages";
import { useAuth } from "@/context/AuthContext";
import {
  cancelBookingHold,
  getProjectionSeatWebSocketUrl,
  getProjectionSeatMap,
  holdBookingSeats,
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
  return new Date(value).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export default function SeatSelectionPage() {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, openSignIn, showToast } = useAuth();
  const projectionId = searchParams.get("projectionId") ?? "";
  const mode = getMode(searchParams.get("mode"));
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

  const startEmptyHold = useCallback(async () => {
    if (!projectionId || isUpdating) {
      return;
    }

    try {
      setIsUpdating(true);
      const response = await holdBookingSeats({
        projectionId,
        seatTemplateIds: [],
      });

      setHold(response);
      setSelectedSeatIds(new Set());
      setIsSessionExpired(false);
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.status === 400
          ? getApiErrorMessage(error)
          : "Seat selection session could not be started.";

      showToast(message, "error");
    } finally {
      setIsUpdating(false);
    }
  }, [isUpdating, projectionId, showToast]);

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
    if (!currentUser || !seatMap || hold || isSessionExpired || isUpdating) {
      return;
    }

    void startEmptyHold();
  }, [
    currentUser,
    hold,
    isSessionExpired,
    isUpdating,
    seatMap,
    startEmptyHold,
  ]);

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
    showToast("Seat selection session expired. Please start again.", "error");
  }, [showToast]);

  async function handleStartNewSession() {
    setIsSessionExpired(false);
    await startEmptyHold();
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

  function handleNextPhaseAction() {
    showToast(
      mode === "reserve"
        ? "Reservation finalization will be implemented in the next phase."
        : "Stripe checkout will be implemented in the next phase.",
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-page-background">
        <div className="mx-auto w-full max-w-360 px-4 pt-12 pb-20 md:px-8 lg:px-23">
          <PageStatusCard label="Loading seat map..." />
        </div>
      </main>
    );
  }

  if (errorMessage || !seatMap) {
    return (
      <main className="min-h-screen bg-page-background">
        <div className="mx-auto w-full max-w-360 px-4 pt-12 pb-20 md:px-8 lg:px-23">
          <PageStatusCard label={errorMessage || "Seat map was not found."} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-page-background">
      <div className="mx-auto w-full max-w-360 px-4 pt-12 pb-20 md:px-8 lg:px-23">
        <button
          type="button"
          onClick={handleCancelHold}
          className="text-body-md font-semibold text-brand-red"
        >
          Back to Movie Details
        </button>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[14px] leading-5 font-semibold tracking-[0.1em] text-brand-red uppercase">
              Seat Options
            </p>
            <h1 className="mt-2 text-[32px] leading-10 font-bold tracking-[-0.0015em] text-page-heading">
              {seatMap.movieTitle}
            </h1>
            <p className="mt-2 text-body-md text-page-muted">
              {seatMap.venueName}, {seatMap.cityName} - {seatMap.hallName} -{" "}
              {formatProjectionDateTime(seatMap.startTime)}
            </p>
          </div>
          <SessionTimer
            expiresAt={hold?.expiresAt}
            onExpired={handleSessionExpired}
          />
        </div>

        {isSessionExpired && (
          <div className="mt-6 rounded-2xl border border-brand-red/30 bg-brand-red/10 p-4 text-body-md text-brand-red">
            Your seat selection session expired. Start a new session to choose
            seats again.
            <button
              type="button"
              onClick={handleStartNewSession}
              className="ml-3 font-bold underline"
            >
              Start new session
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <SeatGrid
            seats={seatMap.seats}
            selectedSeatIds={selectedSeatIds}
            isUpdating={isUpdating || isSessionExpired}
            onToggleSeat={handleToggleSeat}
          />
          <BookingSummary
            seats={selectedSeats}
            totalPrice={totalPrice}
            actionLabel={
              mode === "reserve"
                ? "Make Reservation (coming next)"
                : "Continue to Payment (coming next)"
            }
            isActionDisabled={selectedSeats.length === 0 || isSessionExpired}
            isUpdating={isUpdating}
            onAction={handleNextPhaseAction}
          />
        </div>
      </div>
    </main>
  );
}
