type RememberMeCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function RememberMeCheckbox({
  checked,
  onChange,
}: RememberMeCheckboxProps) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-3 text-body-md font-semibold text-auth-text-muted">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-sm border ${
          checked
            ? "border-auth-text-primary bg-auth-text-primary text-brand-red"
            : "border-auth-text-primary bg-transparent"
        }`}
      >
        {checked && <span className="text-sm font-bold leading-none">✓</span>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      Remember me
    </label>
  );
}
