import { Link } from "react-router-dom";
import FilmIcon from "@/components/ui/icons/FilmIcon";

type CurrentlyShowingEmptyStateProps = {
  hasActiveFilters: boolean;
};

export default function CurrentlyShowingEmptyState({
  hasActiveFilters,
}: CurrentlyShowingEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-card-border bg-card-background px-6 py-14 text-center shadow-page-input md:px-10 md:py-20">
      <div className="mx-auto flex max-w-[620px] flex-col items-center">
        <div className="text-icon-default">
          <FilmIcon />
        </div>

        <p className="mt-6 text-[16px] leading-6 tracking-[0.005em] font-semibold text-page-heading">
          {hasActiveFilters
            ? "No movies found for selected filters."
            : "No movies to preview for current date."}
        </p>

        <p className="mt-4 text-[16px] leading-6 tracking-[0.005em] text-page-muted">
          {hasActiveFilters
            ? "Try adjusting your filters or selecting another date to explore available projections."
            : "We are working on updating our schedule for upcoming movies. Stay tuned for amazing movie experience or explore our other exciting cinema features in the meantime!"}
        </p>

        <Link
          to="/upcoming"
          className="mt-8 inline-flex h-12 cursor-pointer items-center justify-center rounded-lg bg-card-background px-5 text-[16px] leading-6 tracking-[0.005em] font-semibold text-brand-red underline transition-colors hover:bg-brand-red hover:text-pricing-button-featured-text"
        >
          Explore Upcoming Movies
        </Link>
      </div>
    </div>
  );
}
