import { Link } from "react-router-dom";

type SectionHeaderProps = {
  title: string;
  seeAllTo: string;
};

export default function SectionHeader({ title, seeAllTo }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[32px] leading-10 font-bold tracking-[0.0075em] text-section-heading-text">
        {title}
      </h2>

      <Link
        to={seeAllTo}
        className="text-[16px] leading-6 font-semibold tracking-[0.015em] text-section-link-text"
      >
        See All
      </Link>
    </div>
  );
}
