import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

type BaseFieldProps = {
  id: string;
  label: string;
  icon?: ReactNode;
  error?: string;
};

type ProfileInputFieldProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement> & {
    variant?: "input";
  };

type ProfileSelectFieldProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    variant: "select";
  };

type ProfileFormFieldProps = ProfileInputFieldProps | ProfileSelectFieldProps;

export default function ProfileFormField(props: ProfileFormFieldProps) {
  const { id, label, icon, error, className, variant = "input", ...fieldProps } =
    props;
  const hasError = Boolean(error);
  const baseClassName = `h-12 w-full rounded-lg border bg-white px-4 text-body-md text-page-heading shadow-page-input outline-none transition placeholder:text-auth-input-muted disabled:cursor-not-allowed disabled:bg-page-background disabled:text-page-muted ${
    hasError
      ? "border-auth-error"
      : "border-auth-input-border focus:border-brand-red"
  } ${icon ? "pl-11" : ""} ${className ?? ""}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[14px] leading-5 font-semibold text-page-heading"
      >
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        ) : null}
        {variant === "select" ? (
          <select
            id={id}
            className={baseClassName}
            {...(fieldProps as SelectHTMLAttributes<HTMLSelectElement>)}
          />
        ) : (
          <input
            id={id}
            className={baseClassName}
            {...(fieldProps as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
      {error ? (
        <p className="mt-2 text-xs leading-4 text-auth-error">{error}</p>
      ) : null}
    </div>
  );
}
