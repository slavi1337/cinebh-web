type VipSeatIconProps = {
  className?: string;
};

export default function VipSeatIcon({
  className = "h-4 w-4 shrink-0",
}: VipSeatIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="m8 1.5 1.8 3.9 4.2.5-3.1 2.9.9 4.1L8 10.7l-3.8 2.2.9-4.1L2 5.9l4.2-.5L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
