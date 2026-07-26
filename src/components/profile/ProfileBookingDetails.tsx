import ProfileMovieMeta from "@/components/profile/ProfileMovieMeta";
import { formatBookingDateTime } from "@/utils/bookingDisplay";

type ProfileBookingDetailsProps = {
  startTime: string;
  venueName: string;
  cityName: string;
  pgRating: string | null;
  language: string | null;
  durationMinutes: number | null;
};

export default function ProfileBookingDetails({
  startTime,
  venueName,
  cityName,
  pgRating,
  language,
  durationMinutes,
}: ProfileBookingDetailsProps) {
  return (
    <div>
      <h3 className="text-body-md font-bold text-page-muted">
        Booking Details
      </h3>
      <p className="mt-4 text-body-md text-page-heading">
        {formatBookingDateTime(startTime)}
      </p>
      <p className="mt-4 text-body-md text-page-heading">
        {venueName}, {cityName}
      </p>
      <ProfileMovieMeta
        pgRating={pgRating}
        language={language}
        durationMinutes={durationMinutes}
      />
    </div>
  );
}
