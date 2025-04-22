import { LoginForm } from "@/components/auth/LoginForm";

import { Title } from "@/components/Title";
import { useAuth } from "@/hooks/useAuth";

export function SignIn() {
  useAuth({ redirectToIfAuthenticated: "/admin-panel" });

  return (
    <>
      <Title>Sign In</Title>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
