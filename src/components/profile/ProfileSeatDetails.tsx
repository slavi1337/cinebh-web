import type { SelectedSeat } from "@/types/booking";
import { formatBookingAmount, seatLabel } from "@/utils/bookingDisplay";

type ProfileSeatDetailsProps = {
  seats: SelectedSeat[];
  hallName: string;
  totalPrice: number;
  title?: string;
};

export default function ProfileSeatDetails({
  seats,
  hallName,
  totalPrice,
  title = "Seats Details",
}: ProfileSeatDetailsProps) {
  return (
    <div>
      <h3 className="text-body-md font-bold text-page-muted">{title}</h3>
      <p className="mt-4 text-body-md text-page-heading">
        <span className="text-page-muted">Seat(s): </span>
        <span className="font-semibold">{seats.map(seatLabel).join(", ")}</span>
      </p>
      <p className="mt-4 text-body-md text-page-heading">
        <span className="text-page-muted">Hall: </span>
        <span className="font-semibold">{hallName}</span>
      </p>
      <p className="mt-4 text-body-md text-page-heading">
        <span className="text-page-muted">Total Price: </span>
        <span className="font-semibold">{formatBookingAmount(totalPrice)}</span>
      </p>
    </div>
  );
}
