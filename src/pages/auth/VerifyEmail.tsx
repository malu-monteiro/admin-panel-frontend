import { Title } from "@/components/Title";
import { AuthPageLayout } from "@/modules/auth/components/AuthPageLayout";
import { VerifyEmailForm } from "@/modules/auth/components/VerifyEmailForm";

export function VerifyEmail() {
  return (
    <>
      <Title>Verify Your Email</Title>

      <AuthPageLayout>
        <VerifyEmailForm />
      </AuthPageLayout>
    </>
  );
}
