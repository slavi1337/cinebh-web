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
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!apiBaseUrl) {
    window.location.href = API_ENDPOINTS.auth.googleOAuth;
    return;
  }

  const oauthBaseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, "");
  window.location.href = `${oauthBaseUrl}${API_ENDPOINTS.auth.googleOAuth}`;
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
