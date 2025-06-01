import { Title } from "@/components/Title";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { AuthPageLayout } from "@/modules/auth/components/AuthPageLayout";
import { LoginFormWrapper } from "@/modules/auth/components/LoginFormWrapper";

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
