import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  validatePassword,
  handleApiError,
} from "@/modules/auth/utils/authUtils";

import { useResetPasswordMutation } from "@/modules/auth/hooks/useResetPasswordMutation";

import { Slideshow } from "./Slideshow";

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/sign-in", { state: { error: "Invalid reset link " } });
    }
  }, [token, navigate]);

  const resetPasswordMutation = useResetPasswordMutation(token);

  const passwordError = password ? validatePassword(password) : "";
  const confirmError =
    password && confirmPassword && password !== confirmPassword
      ? "Passwords do not match"
      : "";
  const error = passwordError || confirmError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      setSubmitError(error);
      return;
    }

    setSubmitError("");
    resetPasswordMutation.mutate(password, {
      onError: (error) => setSubmitError(handleApiError(error)),
    });
  };

  return (
    <Card className="relative overflow-hidden w-full max-w-sm md:max-w-3xl">
      <CardContent className="grid relative z-10 p-0 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">New Password</h1>
              <p className="text-balance text-muted-foreground">
                Enter your new password
              </p>
            </div>

            {submitError && (
              <div className="text-red-500 text-sm flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {submitError}
              </div>
            )}

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  pattern="^(?=.*[A-Za-z])(?=.*\d).{6,}$"
                  title="Password must contain at least 6 characters, including one letter and one number"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div
                className="text-red-500 text-sm flex items-center gap-2 mb-2"
                style={{
                  visibility: error ? "visible" : "hidden",
                  minHeight: "1.25rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error || <span className="invisible">Placeholder</span>}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                resetPasswordMutation.isPending ||
                !!error ||
                !password ||
                !confirmPassword
              }
            >
              {resetPasswordMutation.isPending
                ? "Resetting..."
                : "Reset Password"}
            </Button>
          </div>
        </form>

        <div className="hidden md:block absolute right-0 inset-y-[-24px] w-1/2 rounded-r-xl overflow-hidden">
          <Slideshow />
        </div>
      </CardContent>
    </Card>
  );
}
