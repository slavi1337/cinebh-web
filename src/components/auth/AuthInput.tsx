import type { ReactNode } from "react";

type AuthInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  icon: ReactNode;
  error?: string;
  reserveErrorSpace?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export default function AuthInput({
  id,
  label,
  value,
  placeholder,
  type = "text",
  icon,
  error,
  reserveErrorSpace = false,
  onChange,
  onBlur,
}: AuthInputProps) {
  const hasValue = value.trim().length > 0;
  const hasError = Boolean(error);
  const shouldReserveErrorSpace = reserveErrorSpace || hasError;

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
        <span
          className={`flex shrink-0 items-center ${
            hasError
              ? "text-auth-error"
              : hasValue
                ? "text-brand-red"
                : "text-icon-default"
          }`}
        >
          {icon}
        </span>

        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          className={`h-full w-full bg-transparent text-body-md font-normal outline-none placeholder:text-auth-input-muted ${
            hasError ? "text-auth-error" : "text-auth-input-text"
          }`}
        />
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
