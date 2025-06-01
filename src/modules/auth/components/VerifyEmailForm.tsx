import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Loader2 } from "lucide-react";

import { verifyEmail } from "@/modules/auth/services/verifyEmail";

import type { VerifyEmailResponse } from "@/types";

import {
  VERIFY_TOKEN_REGEX,
  VERIFY_TOKEN_ERROR,
} from "@/modules/auth/utils/validation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function VerifyEmailForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [inputToken, setInputToken] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const verifyMutation = useMutation<VerifyEmailResponse, Error, string>({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      setSuccess(data.message);
      if (data.newEmail) {
        localStorage.setItem("userEmail", data.newEmail);
      }
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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const verificationToken = inputToken || token;

      if (!verificationToken) {
        setError("Please enter your verification token");
        return;
      }

      if (!VERIFY_TOKEN_REGEX.test(verificationToken)) {
        setError(VERIFY_TOKEN_ERROR);
        return;
      }

      verifyMutation.mutate(verificationToken);
    },
    [inputToken, token, verifyMutation]
  );

  useEffect(() => {
    if (token) setInputToken(token);
  }, [token]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/admin-panel");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Confirm Email Change</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">Verification Token</Label>
          <Input
            id="token"
            value={inputToken}
            onChange={(e) => {
              setInputToken(e.target.value);
              if (error) setError("");
            }}
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
          aria-busy={verifyMutation.isPending}
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
