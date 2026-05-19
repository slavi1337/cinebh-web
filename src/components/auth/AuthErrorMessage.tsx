type AuthErrorMessageProps = {
  message: string;
  center?: boolean;
};

export default function AuthErrorMessage({
  message,
  center = false,
}: AuthErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`w-full rounded-lg border border-auth-error bg-auth-error/10 px-4 py-3 text-sm leading-5 text-auth-text-primary ${
        center ? "text-center" : ""
      }`}
    >
      {message}
    </div>
  );
}
