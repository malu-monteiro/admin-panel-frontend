import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthContext } from "@/modules/auth/hooks/useAuthContext";

import { ApiResponse, ErrorResponse, LoginSuccessData } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

export function useLoginForm() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin-panel";

  const handleApiError = (error: unknown): string => {
    if (error instanceof Error) {
      try {
        const errorData: ErrorResponse = JSON.parse(error.message);
        if (errorData.error === "Invalid credentials") {
          return "Email or password is incorrect.";
        }
        if (typeof errorData.error === "string") {
          return errorData.error;
        }
        if (typeof errorData.message === "string") {
          return errorData.message;
        }
      } catch (e) {
        if (error.message === "Invalid credentials") {
          return "Email or password is incorrect.";
        }
        return error.message;
      }
    }
    return "An unknown error occurred. Please try again.";
  };

  const loginMutation = useMutation<
    ApiResponse<LoginSuccessData>,
    Error,
    { email: string; password: string }
  >({
    mutationFn: async (credentials) => {
      const response = await fetch(`${API_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();

        try {
          const parsedError: ErrorResponse = JSON.parse(errorText);
          throw new Error(
            parsedError.error || parsedError.message || "Unknown error"
          );
        } catch {
          throw new Error(errorText || "Network error");
        }
      }
      return response.json();
    },

    onSuccess: (data) => {
      if (data.data.token) {
        localStorage.setItem("authToken", data.data.token);
        login(data.data.token, {
          name: data.data.name || "Admin",
          email: data.data.email,
        });
        setTimeout(() => navigate(from, { replace: true }), 300);
      } else {
        console.error("Token not found in login response", data);
      }
    },
  });

  return { loginMutation, handleApiError };
}
