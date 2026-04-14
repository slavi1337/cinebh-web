import type { ReactNode } from "react";
import type { FilterOption } from "@/types/common";
import ChevronDownIcon from "@/components/ui/icons/ChevronDownIcon";

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder: string;
  icon: ReactNode;
  disabled?: boolean;
};

export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  icon,
  disabled = false,
}: FilterSelectProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-icon-default">
        {icon}
      </div>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full cursor-pointer appearance-none rounded-lg border border-border-default bg-card-background pr-10 pl-11 text-body-md text-page-muted shadow-page-input outline-none transition-colors disabled:cursor-not-allowed disabled:bg-pagination-button-hover"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-venue-card-text">
        <ChevronDownIcon />
      </div>
    </div>
  );
}
