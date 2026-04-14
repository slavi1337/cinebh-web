import { formatDateInputValue } from "@/utils/date";

type DatePreviewFieldProps = {
  label: string;
  value?: Date;
};

export default function DatePreviewField({
  label,
  value,
}: DatePreviewFieldProps) {
  return (
    <div className="flex h-15 w-35 flex-col justify-center rounded-xl border border-[#D0D5DD] bg-white px-3">
      <span className="text-[12px] leading-4 tracking-[0.0015em] font-normal text-page-muted">
        {label}
      </span>

      <span className="mt-1 text-body-md font-normal text-page-heading">
        {formatDateInputValue(value)}
      </span>
    </div>
  );
}
