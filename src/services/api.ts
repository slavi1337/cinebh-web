import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "https://api.cinebh.com:8443/api/v1",
  withCredentials: true,
});

export default api;
