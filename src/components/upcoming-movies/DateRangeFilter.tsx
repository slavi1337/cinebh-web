import { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import CalendarRangeIcon from "@/components/ui/icons/CalendarRangeIcon";
import ChevronDownIcon from "@/components/ui/icons/ChevronDownIcon";
import FilterActionButton from "./FilterActionButtonProps";
import {
  formatDateInputValue,
  parseLocalIsoDate,
  toNullableLocalIsoDate,
} from "@/utils/date";
import DatePreviewField from "./DatePreviewField";

type DateRangeFilterProps = {
  startDate: string;
  endDate: string;
  onChange: (startDate: string | null, endDate: string | null) => void;
  disabled?: boolean;
};

export default function DateRangeFilter({
  startDate,
  endDate,
  onChange,
  disabled = false,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localRange, setLocalRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (isOpen) {
      setLocalRange({
        from: parseLocalIsoDate(startDate),
        to: parseLocalIsoDate(endDate),
      });
    }
  }, [isOpen, startDate, endDate]);

  function handleApply() {
    onChange(
      toNullableLocalIsoDate(localRange?.from),
      toNullableLocalIsoDate(localRange?.to),
    );
    setIsOpen(false);
  }

  function handleCancel() {
    setIsOpen(false);
  }

  const triggerLabel =
    startDate && endDate
      ? `${formatDateInputValue(parseLocalIsoDate(startDate))} - ${formatDateInputValue(parseLocalIsoDate(endDate))}`
      : "Date Range";

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex h-12 w-full cursor-pointer items-center justify-between rounded-lg border border-border-default bg-white px-4 text-left text-body-md text-page-muted shadow-page-input outline-none transition-colors hover:border-[#D0D5DD] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="text-icon-default">
              <CalendarRangeIcon />
            </span>
            <span className="truncate">{triggerLabel}</span>
          </span>

          <span className="shrink-0 text-[#98A2B3]">
            <ChevronDownIcon />
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="z-50 w-85 rounded-2xl border border-border-default bg-white p-4 shadow-movie-card"
        >
          <div className="mb-4 flex items-center gap-3">
            <DatePreviewField label="Start Date" value={localRange?.from} />
            <DatePreviewField label="End Date" value={localRange?.to} />
          </div>

          <DayPicker
            mode="range"
            selected={localRange}
            onSelect={setLocalRange}
            className="upcoming-daypicker m-0!"
            classNames={{
              months: "flex flex-col gap-4",
              month: "space-y-4",
              caption: "relative mb-2 flex h-8 items-center justify-center",
              caption_label:
                "block w-full px-10 text-center text-body-md font-medium text-page-heading",
              nav: "absolute top-0 left-0 right-0 flex h-8 items-center justify-between",
              button_previous:
                "inline-flex h-8 w-8 items-center justify-center rounded-md bg-white transition-colors hover:bg-[#b22222] hover:cursor-pointer",
              button_next:
                "inline-flex h-8 w-8 items-center justify-center rounded-md bg-white transition-colors hover:bg-[#b22222] hover:cursor-pointer",
              chevron: "fill-[#344054]",
              month_grid: "w-full border-collapse",
              weekdays: "mb-2 grid grid-cols-7",
              weekday:
                "text-center text-[12px] leading-4 font-medium uppercase text-page-muted",
              week: "grid grid-cols-7",
              day: "flex h-10 w-10 items-center justify-center p-0 text-center text-[14px] leading-5",
              day_button:
                "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-page-heading transition-colors hover:bg-[#f9fafb]",
              selected:
                "bg-brand-red text-white hover:bg-[#8b1a1a] hover:text-white",
              range_start:
                "bg-brand-red !text-white rounded-full hover:bg-[#8b1a1a] hover:!text-white",
              range_end:
                "bg-brand-red !text-white rounded-full hover:bg-[#8b1a1a] hover:!text-white",
              range_middle: "!bg-[#fde3e3] text-page-heading rounded-none",
              today: "border border-brand-red font-semibold text-brand-red",
              outside: "pointer-events-none text-[#d0d55d] opacity-50",
              disabled: "text-[#d0d5dd] opacity-50",
              hidden: "invisible",
            }}
          />

          <div className="mt-5 flex items-center justify-end gap-3">
            <FilterActionButton
              label="Cancel"
              onClick={handleCancel}
              className="border border-brand-red bg-white text-brand-red hover:bg-red-50"
            />

            <FilterActionButton
              label="Apply"
              onClick={handleApply}
              className="bg-brand-red text-white hover:bg-[#8b1a1a]"
            />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
