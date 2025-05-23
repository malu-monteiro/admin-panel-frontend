import { useAuth } from "@/hooks/useAuth";

import { Title } from "@/components/Title";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export function ResetPassword() {
  useAuth({ redirectToIfAuthenticated: "/admin-panel" });

  return (
    <>
      <Title>Reset Password</Title>

      <AuthPageLayout>
        <ResetPasswordForm />
      </AuthPageLayout>
    </>
  );
}
