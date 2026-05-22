import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  VerifyAccountRequest,
} from "@/types/auth";

export async function loginUser(request: LoginRequest): Promise<AuthUser> {
  const response = await api.post<AuthUser>(API_ENDPOINTS.auth.login, request);
  return response.data;
}

export function loginWithGoogle() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  window.location.href = `${baseUrl}${API_ENDPOINTS.auth.googleOAuth}`;
}

export async function registerUser(request: RegisterRequest): Promise<void> {
  await api.post(API_ENDPOINTS.auth.signup, request);
}

export async function verifyAccount(
  request: VerifyAccountRequest,
): Promise<void> {
  await api.post(API_ENDPOINTS.auth.verify, request);
}

export async function refreshAuth(): Promise<void> {
  await api.post(API_ENDPOINTS.auth.refresh);
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await api.get<AuthUser>(API_ENDPOINTS.auth.me);
  return response.data;
}

export async function logoutUser(): Promise<void> {
  await api.post(API_ENDPOINTS.auth.logout);
}
