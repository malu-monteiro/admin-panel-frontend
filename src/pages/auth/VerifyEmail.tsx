import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { Title } from "@/components/Title";

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
