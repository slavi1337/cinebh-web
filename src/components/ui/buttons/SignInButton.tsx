type SignInButtonProps = {
  onClick?: () => void;
};

export default function SignInButton({ onClick }: SignInButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-12 cursor-pointer rounded-lg border border-white bg-transparent px-5 text-body-md font-semibold text-white transition-colors hover:bg-white/10 hover:text-white"
    >
      Sign In
    </button>
  );
}
