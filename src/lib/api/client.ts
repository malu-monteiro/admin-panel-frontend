import { ErrorResponse } from "@/types";

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 6000,
  withCredentials: true,
});

// Used for non-authenticated requests, primarily for token refresh.

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

// Manages concurrent token refresh requests.

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: Promise<AxiosResponse>) => void;
  reject: (error: AxiosError) => void;
  config: AxiosRequestConfig;
}> = [];

const processQueue = (error?: AxiosError | null, token?: string) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
      return;
    }

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    resolve(API(config));
  });
  failedQueue = [];
};

async function refreshToken() {
  if (isRefreshing) {
    // If a refresh is in progress, queue the request.

    return new Promise<AxiosResponse>((resolve, reject) => {
      failedQueue.push({ resolve, reject, config: {} as AxiosRequestConfig });
    });
  }

  isRefreshing = true;
  try {
    const response = await axiosPlain.post("/auth/refresh-token");
    const newToken = response.data.token;
    localStorage.setItem("authToken", newToken);
    processQueue(null, newToken);
    return newToken;
  } catch (error) {
    processQueue(error as AxiosError);
    throw error;
  } finally {
    isRefreshing = false;
  }
}

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handles 401 Unauthorized errors: attempts token refresh and retries original request.

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        localStorage.setItem("authToken", newToken);
        originalRequest.headers!.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("authToken");
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      }
    }

    if (error.message) {
      error.message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Unknown error";
    } else if (error.request) {
      error.message = "No response from the server";
    }

    return Promise.reject(error);
  }
);

export const isAxiosError = axios.isAxiosError;

export default API;
