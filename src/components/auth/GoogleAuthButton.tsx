import GoogleIcon from "@/components/ui/icons/GoogleIcon";

type GoogleAuthButtonProps = {
  label?: string;
  onClick?: () => void;
};

export default function GoogleAuthButton({
  label = "Login with",
  onClick,
}: GoogleAuthButtonProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-body-md font-normal text-auth-text-primary">{label}</p>

      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer text-auth-text-primary transition-opacity hover:opacity-80"
      >
        <GoogleIcon className="h-7 w-7" />
      </button>
    </div>
  );
}
