import { useAuth } from "@/modules/auth/hooks/useAuth";

import { Title } from "@/components/Title";

import { AuthPageLayout } from "@/modules/auth/components/AuthPageLayout";
import { ResetPasswordForm } from "@/modules/auth/components/ResetPasswordForm";

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
