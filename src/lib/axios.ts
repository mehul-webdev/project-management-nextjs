import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_API_URL ||
    process.env.NEXT_PUBLIC_BASE_LOCAL_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
// Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const fullURL = (config.baseURL || "") + (config.url || "");
//     console.log("Request URL:", fullURL);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
export default api;
