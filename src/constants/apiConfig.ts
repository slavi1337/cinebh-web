const DEFAULT_API_BASE_URL = "https://api.cinebh.com:8443/api/v1";
const CONFIGURED_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

export function getApiBaseUrl() {
  return CONFIGURED_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function getConfiguredApiBaseUrl() {
  return CONFIGURED_API_BASE_URL;
}
