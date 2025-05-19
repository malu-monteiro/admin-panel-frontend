import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Slideshow from "@/components/auth/Slideshow";
import { Card, CardContent } from "@/components/ui/card";

type LoginFormProps = React.ComponentProps<"div">;

const API_URL = import.meta.env.VITE_API_URL;

export function LoginForm({ className, ...props }: LoginFormProps) {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleApiError = (error: unknown): string => {
    if (error instanceof Error) {
      try {
        const errorData = JSON.parse(error.message);
        return errorData.error || errorData.message || error.message;
      } catch {
        return error.message;
      }
    }
    return "An unknown error ocurred";
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Login failed");
      }
      return response.json();
    },

    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);

      login(data.token, {
        name: data.name || "Admin",
        email: data.email,
      });

      setTimeout(() => {
        navigate("/admin-panel", { replace: true });
      }, 100);
    },

    onError: (error: Error) => {
      const errorMessage = handleApiError(error);
      setLoginError(errorMessage);

      if (errorMessage.includes("Email not verified")) {
        navigate("/verify-email");
      }
      console.error("Login error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    loginMutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send reset email");
      }
      return response.json();
    },
    onSuccess: () => {
      setEmailSent(true);
    },
    onError: (error: Error) => {
      setForgotPasswordError(handleApiError(error));
    },
  });

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    forgotPasswordMutation.mutate(formData.get("email") as string);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative overflow-hidden">
        <CardContent className="grid relative z-10 p-0 md:grid-cols-2">
          {!showForgotPassword ? (
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome</h1>
                  <p className="text-balance text-muted-foreground">
                    Login to your Admin Panel account
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      onClick={() => setShowForgotPassword(true)}
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                  {loginError && (
                    <div className="text-red-500 text-center mt-2">
                      {loginError}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Password Recovery</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your email to reset your password
                  </p>
                </div>
                {emailSent ? (
                  <div className="px-4 py-3 text-center text-green-500 bg-green-100 rounded-md">
                    We've sent a link to your email.
                  </div>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                      />
                    </div>

                    {forgotPasswordError && (
                      <div className="text-red-500 text-center">
                        {forgotPasswordError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending
                        ? "Sending..."
                        : "Send Reset Link"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Back to login
                    </Button>
                  </>
                )}
              </div>
            </form>
          )}

          <div className="hidden md:block absolute right-0 inset-y-[-24px] w-1/2 rounded-r-xl overflow-hidden">
            <Slideshow />
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
