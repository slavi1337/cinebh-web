type EyeOffIconProps = {
  className?: string;
};

export default function EyeOffIcon({ className = "h-6 w-6" }: EyeOffIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="m4 4 16 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.5 6.7A8.4 8.4 0 0 1 12 6.3c5.5 0 8.5 5.7 8.5 5.7a15 15 0 0 1-2.3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.2 14.2a2.5 2.5 0 0 1-3.4-3.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.6 8.2A14.7 14.7 0 0 0 3.5 12s3 5.7 8.5 5.7c.9 0 1.8-.2 2.5-.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
