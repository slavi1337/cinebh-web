import type { SelectedSeat } from "@/types/booking";

type BookingSummaryProps = {
  seats: SelectedSeat[];
  totalPrice: number;
  actionLabel: string;
  isActionDisabled: boolean;
  isUpdating: boolean;
  onAction: () => void;
};

function formatSeatLabel(seat: SelectedSeat) {
  return `${seat.row}${seat.number}`;
}

export default function BookingSummary({
  seats,
  totalPrice,
  actionLabel,
  isActionDisabled,
  isUpdating,
  onAction,
}: BookingSummaryProps) {
  return (
    <aside className="rounded-3xl border border-movie-details-border bg-white p-5 shadow-movie-card">
      <h2 className="text-[20px] leading-6 font-bold text-page-heading">
        Chosen Seats
      </h2>

      {seats.length ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-movie-details-border">
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-page-background px-4 py-3 text-[13px] font-semibold text-page-muted">
            <span>Seat</span>
            <span>Type</span>
            <span className="text-right">Price</span>
          </div>
          {seats.map((seat) => (
            <div
              key={seat.id}
              className="grid grid-cols-[1fr_1fr_1fr] border-t border-movie-details-border px-4 py-3 text-body-md text-page-heading"
            >
              <span className="font-semibold">{formatSeatLabel(seat)}</span>
              <span className="capitalize">{seat.type.toLowerCase()}</span>
              <span className="text-right font-semibold">
                {seat.price.toFixed(2)} BAM
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-body-md text-page-muted">
          Select at least one available seat to continue.
        </p>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-movie-details-border pt-5">
        <span className="text-body-md font-semibold text-page-muted">
          Total Price
        </span>
        <span className="text-[24px] leading-8 font-bold text-page-heading">
          {totalPrice.toFixed(2)} BAM
        </span>
      </div>

      <button
        type="button"
        disabled={isActionDisabled || isUpdating}
        onClick={onAction}
        className="mt-6 h-12 w-full rounded-lg bg-brand-red text-body-md font-semibold text-white transition-colors enabled:cursor-pointer enabled:hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:bg-movie-details-border"
      >
        {isUpdating ? "Updating..." : actionLabel}
      </button>
    </aside>
  );
}
