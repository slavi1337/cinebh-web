import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import RightArrowIcon from "../ui/icons/RightArrowIcon";

type SectionPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  visibleItems: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function SectionPagination({
  currentPage,
  totalPages,
  totalItems,
  visibleItems,
  onPrevious,
  onNext,
}: SectionPaginationProps) {
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  const shownItems = Math.min(currentPage * visibleItems, totalItems);

  return (
    <div className="flex h-12 items-center gap-4">
      <p className="text-[16px] leading-6 tracking-[0.005em] ttext-pagination-text">
        Showing <span className="font-semibold">{shownItems}</span> out of{" "}
        <span className="font-normal">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-pagination-button-border bg-pagination-button-background transition-colors hover:border-pagination-button-border-hover hover:bg-pagination-button-hover disabled:cursor-not-allowed disabled:bg-pagination-button-disabled disabled:hover:border-pagination-button-border disabled:hover:bg-pagination-button-disabled"
        >
          <span
            className={`${
              isPreviousDisabled
                ? "text-pagination-button-icon-disabled"
                : "text-pagination-button-icon"
            }`}
          >
            <LeftArrowIcon />
          </span>
        </button>

        <span />

        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-pagination-button-border bg-pagination-button-background transition-colors hover:border-pagination-button-border-hover hover:bg-pagination-button-hover disabled:cursor-not-allowed disabled:bg-pagination-button-disabled disabled:hover:border-pagination-button-border disabled:hover:bg-pagination-button-disabled"
        >
          <span
            className={`${
              isNextDisabled
                ? "text-pagination-button-icon-disabled"
                : "text-pagination-button-icon"
            }`}
          >
            <RightArrowIcon />
          </span>
        </button>
      </div>
    </div>
  );
}
