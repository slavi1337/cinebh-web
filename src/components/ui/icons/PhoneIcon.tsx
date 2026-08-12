type PhoneIconProps = {
  className?: string;
};

export default function PhoneIcon({ className = "h-4 w-4" }: PhoneIconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5.2 2.5 6.3 5 4.9 6.1a8.2 8.2 0 0 0 5 5l1.1-1.4 2.5 1.1-.4 2.6c-.1.6-.6 1-1.2 1A10.4 10.4 0 0 1 1.6 4.1c0-.6.4-1.1 1-1.2l2.6-.4Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
