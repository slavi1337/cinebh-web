type ProfileLockIconProps = {
  className?: string;
};

export default function ProfileLockIcon({
  className = "h-4 w-4",
}: ProfileLockIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="3.5"
        y="7"
        width="9"
        height="6.5"
        rx="1.3"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d="M5.4 7V5.1a2.6 2.6 0 0 1 5.2 0V7"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}
