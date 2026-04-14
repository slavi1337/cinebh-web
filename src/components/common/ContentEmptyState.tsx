import { Link } from "react-router-dom";
import FilmIcon from "@/components/ui/icons/FilmIcon";

type ContentEmptyStateProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaTo?: string;
};

export default function ContentEmptyState({
  title,
  description,
  ctaLabel = "Explore Upcoming Movies",
  ctaTo = "/upcoming",
}: ContentEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-border-default bg-white px-6 py-14 text-center shadow-page-input md:px-10 md:py-20">
      <div className="mx-auto flex max-w-155 flex-col items-center">
        <div className="text-[#475467]">
          <FilmIcon />
        </div>

        <p className="mt-6 text-body-md font-semibold text-page-heading">
          {title}
        </p>

        <p className="mt-4 text-body-md text-[#475467]">{description}</p>

        <Link
          to={ctaTo}
          className="mt-8 inline-flex h-12 cursor-pointer items-center justify-center rounded-lg bg-white px-5 text-body-md font-semibold text-brand-red underline transition-colors hover:bg-brand-red hover:text-white"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
