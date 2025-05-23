import { useMutation } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

export function useResetPasswordMutation(token: string | null) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (newPassword: string) => {
      const response = await fetch(
        "http://localhost:3000/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    },

    onSuccess: () => {
      navigate("/sign-in", {
        replace: true,
        state: { success: "Password reset successfully!" },
      });
    },
  });
}
