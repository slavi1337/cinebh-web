import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/auth";

export function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const firstValidationError = data?.errors?.[0]?.message;

    return firstValidationError ?? data?.message ?? "Something went wrong.";
  }

  return "Something went wrong.";
}

export function isAccountNotVerifiedError(error: unknown) {
  if (!(error instanceof AxiosError)) {
    return false;
  }

  const data = error.response?.data as ApiErrorResponse | undefined;

  return (
    error.response?.status === 403 &&
    data?.message?.toLowerCase().includes("not verified")
  );
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!name || !domain) {
    return email;
  }

  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
}
