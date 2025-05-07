import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { VerifyEmailResponse } from "@/types";

export function VerifyEmailForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [manualToken, setManualToken] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const verifyMutation = useMutation<VerifyEmailResponse, Error, string>({
    mutationFn: async (verificationToken: string) => {
      const response = await fetch("/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    },
    onSuccess: (data) => {
      if (data.newEmail) {
        localStorage.setItem("userEmail", data.newEmail);
      }

      navigate("/admin-panel", {
        state: { success: data.message },
      });
    },
    onError: (error: Error) => {
      setError(JSON.parse(error.message).message || "Verification failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationToken = token || manualToken;

    if (!verificationToken) {
      setError("Please enter your verification token");
      return;
    }

    verifyMutation.mutate(verificationToken);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        (!token && (
        <div className="space-y-2">
          <Label htmlFor="token">Verification Token</Label>
          <Input
            id="token"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Enter verification token"
          />
        </div>
        ))
        {error && <div className="text-red-500">{error}</div>}
        <Button type="submit" className="w-full">
          {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
        </Button>
      </form>
    </div>
  );
}
