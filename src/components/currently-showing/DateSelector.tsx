import { getTenDayRange } from "@/utils/currentlyShowing";

type DateSelectorProps = {
  selectedDate: string;
  onSelect: (date: string) => void;
};

export default function DateSelector({
  selectedDate,
  onSelect,
}: DateSelectorProps) {
  const dates = getTenDayRange();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 lg:gap-[15px]">
      {dates.map((dateItem) => {
        const isSelected = dateItem.isoDate === selectedDate;

        return (
          <button
            key={dateItem.isoDate}
            type="button"
            onClick={() => onSelect(dateItem.isoDate)}
            className={`h-[84px] cursor-pointer rounded-lg border text-center shadow-page-input transition-colors ${
              isSelected
                ? "border-brand-red bg-brand-red text-pricing-button-featured-text"
                : "border-border-default bg-card-background text-page-heading hover:border-brand-red/40"
            }`}
          >
            <div
              className={`${
                isSelected
                  ? "text-[20px] leading-6 font-bold tracking-[-0.0015em]"
                  : "text-[16px] leading-6 font-semibold tracking-[0.005em]"
              }`}
            >
              {dateItem.label}
            </div>

            <div
              className={`mt-1 text-[16px] leading-6 tracking-[0.005em] font-normal ${
                isSelected
                  ? "text-pricing-button-featured-text"
                  : "text-page-muted"
              }`}
            >
              {dateItem.weekday}
            </div>
          </button>
        );
      })}
    </div>
  );
}
