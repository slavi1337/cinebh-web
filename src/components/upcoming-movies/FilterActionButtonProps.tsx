type FilterActionButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

export default function FilterActionButton({
  label,
  onClick,
  className = "",
  disabled = false,
}: FilterActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 cursor-pointer items-center justify-center rounded-lg px-4 text-[12px] leading-4 tracking-[0.0015em] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {label}
    </button>
  );
}
