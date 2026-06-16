const DEFAULT_API_BASE_URL = "https://api.cinebh.com:8443/api/v1";

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;
}

export function getConfiguredApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
}
