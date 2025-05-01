import { Title } from "@/components/Title";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useAuth } from "@/hooks/useAuth";

export function ResetPassword() {
  useAuth({ redirectToIfAuthenticated: "/admin-panel" });

  return (
    <>
      <Title>Reset Password</Title>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <ResetPasswordForm />
        </div>
      </div>
    </>
  );
}
