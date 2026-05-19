import { useState } from "react";
import EyeIcon from "@/components/ui/icons/EyeIcon";
import EyeOffIcon from "@/components/ui/icons/EyeOffIcon";
import LockIcon from "@/components/ui/icons/LockIcon";

type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  reserveErrorSpace?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export default function PasswordInput({
  id,
  label,
  value,
  placeholder = "Password",
  error,
  reserveErrorSpace = false,
  onChange,
  onBlur,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const hasValue = value.length > 0;
  const hasError = Boolean(error);
  const shouldReserveErrorSpace = reserveErrorSpace || hasError;

  const iconColor = hasError
    ? "text-auth-error"
    : hasValue
      ? "text-brand-red"
      : "text-icon-default";

  const inputClassName =
    !isVisible && hasValue
      ? `h-full w-full bg-transparent pb-1 text-[28px] font-bold leading-none tracking-[0.12em] outline-none placeholder:text-body-md placeholder:font-normal placeholder:tracking-[0.005em] placeholder:text-auth-input-muted ${
          hasError ? "text-auth-error" : "text-auth-input-text"
        }`
      : `h-full w-full bg-transparent text-body-md font-normal outline-none placeholder:text-auth-input-muted ${
          hasError ? "text-auth-error" : "text-auth-input-text"
        }`;

  return (
    <div className="w-full max-w-[400px]">
      <label
        htmlFor={id}
        className={`mb-2 block text-body-md font-semibold ${
          hasError ? "text-auth-error-light" : "text-auth-text-primary"
        }`}
      >
        {label}
      </label>

      <div
        className={`flex h-12 w-full items-center gap-3 rounded-lg border px-4 shadow-page-input ${
          hasError
            ? "border-auth-error bg-[#fffafa]"
            : "border-auth-input-border bg-auth-input-background"
        }`}
      >
        <span className={`flex shrink-0 items-center ${iconColor}`}>
          <LockIcon />
        </span>

        <input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        />

        <button
          type="button"
          onClick={() => setIsVisible((value) => !value)}
          className={`flex cursor-pointer items-center ${
            hasError ? "text-auth-error" : "text-auth-input-muted"
          }`}
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {shouldReserveErrorSpace && (
        <p
          className={`mt-2 min-h-4 text-xs font-normal leading-4 tracking-[0.0015em] text-auth-error-light ${
            hasError ? "visible" : "invisible"
          }`}
        >
          {error ?? "Placeholder"}
        </p>
      )}
    </div>
  );
}
