import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 6000,
  withCredentials: true,
});

const axiosPlain = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 6000,
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function refreshToken() {
  const response = await axiosPlain.post("/auth/refresh-token");
  return response.data.token;
}

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        localStorage.setItem("authToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("authToken");
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      }
    }

    if (error.message) {
      error.message = error.response.data?.error || "Unknown error";
    } else if (error.request) {
      error.message = "No response from the server";
    }

    return Promise.reject(error);
  }
);

export const isAxiosError = axios.isAxiosError;

export default API;
