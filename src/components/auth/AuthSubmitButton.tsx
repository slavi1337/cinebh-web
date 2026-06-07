type AuthSubmitButtonProps = {
  children: string;
  isLoading?: boolean;
  disabled?: boolean;
};

export default function AuthSubmitButton({
  children,
  isLoading = false,
  disabled = false,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-brand-red px-5 py-3 text-body-md font-semibold text-auth-text-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-100"
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}
