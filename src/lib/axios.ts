import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
// Request interceptor
api.interceptors.request.use(
  (config) => {
    const fullURL = (config.baseURL || "") + (config.url || "");
    console.log("Request URL:", fullURL);
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;
