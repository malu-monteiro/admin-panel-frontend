import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useForgotPassword() {
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
  });

  return { forgotPasswordMutation };
}
