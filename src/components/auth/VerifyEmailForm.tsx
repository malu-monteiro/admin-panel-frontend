import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { VerifyEmailResponse } from "@/types";
import { Loader2 } from "lucide-react";

export function VerifyEmailForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [manualToken, setManualToken] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const verifyMutation = useMutation<VerifyEmailResponse, Error, string>({
    mutationFn: async (verificationToken: string) => {
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
        if (data.newEmail) {
          localStorage.setItem("userEmail", data.newEmail);
        }
        navigate("/admin-panel");
      }, 2000);
    },

    onError: (error: Error) => {
      try {
        const errorData = JSON.parse(error.message);
        setError(errorData.message || "Verification failed");
      } catch {
        setError("An unexpected error occurred");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const verificationToken = manualToken || token;

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

  useEffect(() => {
    if (token) setManualToken(token);
  }, [token]);

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Confirm Email Change</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">Verification Token</Label>
          <Input
            id="token"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Enter verification token"
            disabled={verifyMutation.isPending}
          />
        </div>

        <p className="mb-4 text-muted-foreground">
          {token
            ? "Verification token loaded from link. You may edit if necessary."
            : "Please enter the verification token sent to your email"}
        </p>
        {success && (
          <div className="p-4 text-green-700 bg-green-100 rounded-md">
            {success} Redirecting...
          </div>
        )}

        {error && (
          <div
            className="px-4 py-3 text-red-700 bg-red-100 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </div>
          ) : (
            "Click to update email"
          )}
        </Button>

        <div className="mt-4 text-center">
          <Button
            type="button"
            className="w-full"
            onClick={() => setTimeout(() => navigate("/admin-panel"), 300)}
          >
            Back to Admin Panel
          </Button>
        </div>
      </form>
    </div>
  );
}
