import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import type { LoginFormProps } from "@/types";

export function LoginForm({
  onForgotPassword,
  onSubmit,
  error,
  isLoading,
}: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    onSubmit({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  return (
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
              role="button"
              onClick={onForgotPassword}
              className="ml-auto text-sm underline-offset-2 hover:underline cursor-pointer"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
          {error && (
            <div className="text-red-500 text-center mt-2">{error}</div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
