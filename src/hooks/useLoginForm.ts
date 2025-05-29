import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthContext } from "@/hooks/useAuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export function useLoginForm() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin-panel";

  const handleApiError = (error: unknown): string => {
    if (error instanceof Error) {
      const message = error.message;
      try {
        const errorData = JSON.parse(error.message);

        // Mapeamento para mensagens amigáveis
        if (errorData.error === "Invalid credentials") {
          return "Email or password is incorrect.";
        }
        if (typeof errorData.error === "string") {
          return errorData.error;
        }
        if (typeof errorData.message === "string") {
          return errorData.message;
        }
      } catch {
        // Se não for JSON, use a mensagem padrão
        if (message === "Invalid credentials") {
          return "Email or password is incorrect.";
        }
        return message;
      }
    }
    return "An unknown error occurred. Please try again.";
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      login(data.token, { name: data.name || "Admin", email: data.email });
      setTimeout(() => navigate(from, { replace: true }), 300);
    },
  });

  return { loginMutation, handleApiError };
}
