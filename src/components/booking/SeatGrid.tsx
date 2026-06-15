import type { Seat } from "@/types/booking";

type SeatGridProps = {
  seats: Seat[];
  selectedSeatIds: Set<string>;
  isUpdating: boolean;
  onToggleSeat: (seat: Seat) => void;
};

const SEAT_TYPE_LABELS = {
  REGULAR: "Regular seat",
  VIP: "VIP seat",
  LOVE: "Love seat",
} as const;

function groupSeatsByRow(seats: Seat[]) {
  return seats.reduce<Record<string, Seat[]>>((rows, seat) => {
    rows[seat.row] = [...(rows[seat.row] ?? []), seat];
    return rows;
  }, {});
}

function getSeatButtonClass(seat: Seat, isSelected: boolean) {
  if (isSelected) {
    return "border-brand-red bg-brand-red text-white";
  }

  if (seat.status !== "AVAILABLE") {
    return "border-movie-details-border bg-movie-details-border text-page-muted";
  }

  if (seat.type === "VIP") {
    return "border-[#d7a82f] bg-[#fff8df] text-page-heading hover:border-brand-red/70";
  }

  if (seat.type === "LOVE") {
    return "border-[#c27ba0] bg-[#fff0f6] text-page-heading hover:border-brand-red/70";
  }

  return "border-movie-details-border bg-white text-page-heading hover:border-brand-red/70";
}

export default function SeatGrid({
  seats,
  selectedSeatIds,
  isUpdating,
  onToggleSeat,
}: SeatGridProps) {
  const rows = groupSeatsByRow(seats);
  const rowEntries = Object.entries(rows).sort(([firstRow], [secondRow]) =>
    firstRow.localeCompare(secondRow),
  );
  const seatTypes = Array.from(new Set(seats.map((seat) => seat.type)));

  return (
    <section className="rounded-3xl border border-movie-details-border bg-white p-5 shadow-movie-card md:p-6">
      <div className="mx-auto flex h-8 max-w-170 items-center justify-center rounded-t-[100%] border-t-4 border-page-heading text-[13px] font-semibold tracking-[0.12em] text-page-muted uppercase">
        Screen
      </div>

      <div className="mt-8 overflow-x-auto pb-3">
        <div className="mx-auto min-w-180 max-w-190">
          {rowEntries.map(([row, rowSeats]) => (
            <div
              key={row}
              className="mb-3 grid grid-cols-[32px_1fr] items-center gap-3"
            >
              <span className="text-center text-body-md font-bold text-page-muted">
                {row}
              </span>
              <div className="flex items-center justify-center gap-2">
                {rowSeats
                  .sort((firstSeat, secondSeat) =>
                    Number(firstSeat.number) - Number(secondSeat.number),
                  )
                  .map((seat, index) => {
                    const isSelected = selectedSeatIds.has(seat.id);
                    const isDisabled =
                      isUpdating ||
                      (seat.status !== "AVAILABLE" && !isSelected);
                    const isLoveSeat = seat.type === "LOVE";

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => onToggleSeat(seat)}
                        className={`h-10 rounded-lg border text-[14px] font-bold transition-colors disabled:cursor-not-allowed ${
                          isLoveSeat ? "w-22" : "w-10"
                        } ${index === 4 && !isLoveSeat ? "ml-6" : ""} ${getSeatButtonClass(
                          seat,
                          isSelected,
                        )}`}
                        title={`${seat.row}${seat.number} - ${SEAT_TYPE_LABELS[seat.type]}`}
                      >
                        {seat.row}
                        {seat.number}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-movie-details-border pt-5 md:grid-cols-2">
        <div className="flex flex-wrap gap-4 text-[14px] leading-5 text-page-muted">
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 rounded border border-movie-details-border bg-white" />
            Available
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-brand-red" />
            Selected
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-movie-details-border" />
            Reserved
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-[14px] leading-5 text-page-muted md:justify-end">
          {seatTypes.map((type) => {
            const price = seats.find((seat) => seat.type === type)?.price ?? 0;

            return (
              <span key={type}>
                {SEAT_TYPE_LABELS[type]}:{" "}
                <strong className="text-page-heading">
                  {price.toFixed(2)} BAM
                </strong>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
