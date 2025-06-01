import type { VerifyEmailResponse } from "@/types";

export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  const API_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data;
}
