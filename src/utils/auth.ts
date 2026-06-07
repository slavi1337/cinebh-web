import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/auth";

type GoogleAuthRedirectStatus = "success" | "error" | null;

const GOOGLE_AUTH_QUERY_PARAM = "auth";
const GOOGLE_AUTH_SUCCESS_PARAM = "google-success";
const GOOGLE_AUTH_FAILURE_PARAM = "google-error";

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

export function getGoogleAuthRedirectStatus(): GoogleAuthRedirectStatus {
  const params = new URLSearchParams(window.location.search);
  const status = params.get(GOOGLE_AUTH_QUERY_PARAM);

  if (status === GOOGLE_AUTH_SUCCESS_PARAM) {
    return "success";
  }

  if (status === GOOGLE_AUTH_FAILURE_PARAM) {
    return "error";
  }

  return null;
}

export function clearAuthQueryParams() {
  window.history.replaceState({}, "", window.location.pathname);
}

export function shouldPersistUserInLocalStorage(
  authUserStorageKey: string,
  isGoogleSuccess: boolean,
) {
  return isGoogleSuccess || Boolean(localStorage.getItem(authUserStorageKey));
}
