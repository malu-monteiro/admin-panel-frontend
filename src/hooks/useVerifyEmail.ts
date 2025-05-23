import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { VerifyEmailResponse } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

export function useVerifyEmail() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const [manualToken, setManualToken] = useState(tokenFromUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const verifyMutation = useMutation<VerifyEmailResponse, Error, string>({
    mutationFn: async (verificationToken) => {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    },
    onSuccess: (data) => {
      setSuccess(data.message);
      setTimeout(() => {
        if (data.newEmail) localStorage.setItem("userEmail", data.newEmail);
        navigate("/admin-panel");
      }, 2000);
    },
    onError: (error) => {
      try {
        const errorData = JSON.parse(error.message);
        setError(errorData.message || "Verification failed");
      } catch {
        setError("An unexpected error occurred");
      }
    },
  });

  useEffect(() => {
    if (tokenFromUrl) setManualToken(tokenFromUrl);
  }, [tokenFromUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const verificationToken = manualToken || tokenFromUrl;

    if (!verificationToken) {
      setError("Please enter your verification token");
      return;
    }

    if (!/^[a-zA-Z0-9-_]{20,}$/.test(verificationToken)) {
      setError("Invalid token format");
      return;
    }

    verifyMutation.mutate(verificationToken);
  };

  const handleBack = () => navigate("/admin-panel");

  return {
    manualToken,
    setManualToken,
    isPending: verifyMutation.isPending,
    handleSubmit,
    error,
    success,
    handleBack,
    tokenFromUrl,
  };
}
