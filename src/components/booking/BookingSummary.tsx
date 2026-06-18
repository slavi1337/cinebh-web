import type { Seat, SeatType, SelectedSeat } from "@/types/booking";

type BookingSummaryProps = {
  seats: SelectedSeat[];
  allSeats: Seat[];
  totalPrice: number;
  actionLabel: string;
  isActionDisabled: boolean;
  isUpdating: boolean;
  onAction: () => void;
};

const SEAT_TYPE_LABELS: Record<SeatType, string> = {
  REGULAR: "Regular Seats",
  VIP: "VIP Seats",
  LOVE: "Love Seats",
};

function formatSeatLabel(seat: Pick<SelectedSeat, "row" | "number">) {
  return `${seat.row}${seat.number}`;
}

function formatTotalPrice(totalPrice: number) {
  return `${Number(totalPrice).toFixed(0)} KM`;
}

function seatTypePreview(type: SeatType) {
  if (type === "VIP") {
    return "* XY";
  }

  return "XY";
}

function SeatGuideBox({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={`flex h-9 min-w-12 items-center justify-center rounded-lg border border-movie-details-border px-3 text-[13px] leading-5 ${className}`}
    >
      {children}
    </span>
  );
}

function SeatGuide({ seats }: { seats: Seat[] }) {
  const seatTypes = Array.from(new Set(seats.map((seat) => seat.type)));

  return (
    <div>
      <h2 className="text-center text-body-md font-normal text-page-heading">
        Seat Guide
      </h2>

      <div className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 text-body-md text-page-heading">
            <SeatGuideBox>XY</SeatGuideBox>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-3 text-body-md text-page-heading">
            <SeatGuideBox className="bg-movie-details-border text-page-muted">
              XY
            </SeatGuideBox>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-3 text-body-md text-page-heading">
            <SeatGuideBox className="border-brand-red bg-brand-red text-white">
              XY
            </SeatGuideBox>
            <span>Selected</span>
          </div>
        </div>

        <div className="grid gap-4">
          {seatTypes.map((type) => {
            const price = seats.find((seat) => seat.type === type)?.price ?? 0;

            return (
              <div
                key={type}
                className="flex items-center gap-3 text-body-md text-page-heading"
              >
                <SeatGuideBox className={type === "LOVE" ? "min-w-23" : ""}>
                  {seatTypePreview(type)}
                </SeatGuideBox>
                <span>
                  {SEAT_TYPE_LABELS[type]} ({price.toFixed(0)} BAM)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function BookingSummary({
  seats,
  allSeats,
  totalPrice,
  actionLabel,
  isActionDisabled,
  isUpdating,
  onAction,
}: BookingSummaryProps) {
  return (
    <aside className="flex h-full min-h-96 flex-col">
      <SeatGuide seats={allSeats} />

      <div className="mt-8 border-t border-movie-details-border pt-7">
        <h2 className="text-center text-body-md font-normal text-page-heading">
          Chosen Seats
        </h2>

        <div className="mt-5 grid grid-cols-[1fr_auto] border-b border-movie-details-border pb-3 text-body-md text-page-heading">
          <span>Seat(s)</span>
          <span>Total price</span>
        </div>

        <div className="grid min-h-18 grid-cols-[1fr_auto] items-start pt-4 text-[18px] leading-6 font-bold text-page-heading">
          <span>
            {seats.length ? seats.map(formatSeatLabel).join(", ") : ""}
          </span>
          <span>{seats.length ? formatTotalPrice(totalPrice) : ""}</span>
        </div>
      </div>

      <button
        type="button"
        disabled={isActionDisabled || isUpdating}
        onClick={onAction}
        className="mt-auto h-12 w-full rounded-lg bg-brand-red text-body-md font-semibold text-white transition-colors enabled:cursor-pointer enabled:hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:bg-movie-details-border"
      >
        {isUpdating ? "Updating..." : actionLabel}
      </button>
    </aside>
  );
}
