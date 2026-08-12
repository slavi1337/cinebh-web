import type { Seat } from "@/types/booking";
import VipSeatIcon from "@/components/booking/VipSeatIcon";

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
    const rowSeats = rows[seat.row] ?? [];
    rowSeats.push(seat);
    rows[seat.row] = rowSeats;
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

  return "border-movie-details-border bg-white text-page-heading hover:border-brand-red/70";
}

function SeatLabel({ seat }: { seat: Seat }) {
  const label = `${seat.row}${seat.number}`;

  if (seat.type !== "VIP") {
    return label;
  }

  return (
    <span className="flex items-center justify-center gap-0.5">
      <VipSeatIcon />
      <span>{label}</span>
    </span>
  );
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

  return (
    <section>
      <div className="text-center text-body-md text-page-heading">
        Cinema Screen
      </div>
      <div className="mx-auto mt-7 h-4 w-full max-w-105 overflow-hidden">
        <div className="h-10 rounded-t-[100%] border-t-6 border-brand-red shadow-[0_12px_18px_rgba(178,34,34,0.22)]" />
      </div>

      <div className="mt-12 overflow-x-auto pb-3">
        <div className="mx-auto min-w-118 max-w-132">
          {rowEntries.map(([row, rowSeats]) => (
            <div key={row} className="mb-3 flex justify-center">
              {rowSeats
                .sort(
                  (firstSeat, secondSeat) =>
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
                      className={`mr-2 h-9 rounded-lg border text-[13px] leading-5 font-medium transition-colors disabled:cursor-not-allowed ${
                        isLoveSeat ? "w-23" : "w-11"
                      } ${index === 4 ? "ml-9" : ""} ${getSeatButtonClass(
                        seat,
                        isSelected,
                      )}`}
                      title={`${seat.row}${seat.number} - ${SEAT_TYPE_LABELS[seat.type]}`}
                    >
                      <SeatLabel seat={seat} />
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
