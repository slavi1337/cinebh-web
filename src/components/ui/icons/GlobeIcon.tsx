type GlobeIconProps = {
  className?: string;
};

export default function GlobeIcon({ className = "h-4 w-4" }: GlobeIconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2.7 8h10.6M8 2.5c1.4 1.4 2.1 3.2 2.1 5.5S9.4 12.1 8 13.5C6.6 12.1 5.9 10.3 5.9 8S6.6 3.9 8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
