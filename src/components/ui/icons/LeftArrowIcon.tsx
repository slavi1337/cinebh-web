type LeftArrowIconProps = {
  className?: string;
};

export default function LeftArrowIcon({
  className = "h-5 w-6",
}: LeftArrowIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="m5 12 6-6m-6 6 6 6m-6-6h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
