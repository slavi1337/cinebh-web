type AuthFormSwitchProps = {
  text: string;
  actionText: string;
  onClick: () => void;
};

export default function AuthFormSwitch({
  text,
  actionText,
  onClick,
}: AuthFormSwitchProps) {
  return (
    <p className="text-center text-body-md font-normal text-auth-text-primary">
      {text}{" "}
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer font-semibold underline"
      >
        {actionText}
      </button>
    </p>
  );
}
