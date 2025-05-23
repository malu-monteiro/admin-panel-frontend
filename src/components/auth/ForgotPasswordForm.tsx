import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm({
  onBack,
  onSubmit,
  error,
  isLoading,
  isSuccess,
}: {
  onBack: () => void;
  onSubmit: (email: string) => void;
  error?: string;
  isLoading: boolean;
  isSuccess: boolean;
}) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Password Recovery</h1>
          <p className="text-balance text-muted-foreground">
            Enter your email to reset your password
          </p>
        </div>

        {isSuccess ? (
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <div className="text-red-500 text-center">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </>
        )}

        <Button type="button" variant="outline" onClick={onBack}>
          Back to login
        </Button>
      </div>
    </form>
  );
}
