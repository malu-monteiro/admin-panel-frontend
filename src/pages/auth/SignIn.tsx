import { useAuth } from "@/hooks/useAuth";

import { Title } from "@/components/Title";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { LoginFormWrapper } from "@/components/auth/LoginFormWrapper";

export function SignIn() {
  useAuth({ redirectToIfAuthenticated: "/admin-panel" });

  return (
    <>
      <Title>Sign In</Title>

      <AuthPageLayout>
        <LoginFormWrapper />
      </AuthPageLayout>
    </>
  );
}
