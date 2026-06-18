import { formatBookingDuration } from "@/utils/bookingDisplay";

type ProfileMovieMetaProps = {
  pgRating: string | null;
  language: string | null;
  durationMinutes: number | null;
};

export default function ProfileMovieMeta({
  pgRating,
  language,
  durationMinutes,
}: ProfileMovieMetaProps) {
  const metaItems = [
    pgRating,
    language,
    formatBookingDuration(durationMinutes),
  ].filter(Boolean);

  if (metaItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] leading-5 text-page-heading">
      {metaItems.map((item, index) => (
        <span key={item} className="flex items-center gap-3">
          {index > 0 ? <span className="h-5 w-px bg-brand-red" /> : null}
          {item}
        </span>
      ))}
    </div>
  );
}
