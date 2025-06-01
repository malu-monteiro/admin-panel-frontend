import { useState } from "react";
import { useLoginForm } from "@/modules/auth/hooks/useLoginForm";
import { useForgotPassword } from "@/modules/auth/hooks/useForgotPassword";

import { Slideshow } from "./Slideshow";
import { LoginForm } from "..";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

import { Card, CardContent } from "@/components/ui/card";

import { handleApiError } from "@/modules/auth/utils/authUtils";
import { ForgotPasswordFormProps, LoginFormProps } from "@/types";

export function LoginFormWrapper() {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [loginError, setLoginError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const { loginMutation } = useLoginForm();
  const { forgotPasswordMutation } = useForgotPassword();

  const handleLoginSubmit: LoginFormProps["onSubmit"] = (credentials) => {
    setLoginError("");
    loginMutation.mutate(credentials, {
      onError: (error) => setLoginError(handleApiError(error)),
    });
  };

  const handleForgotPasswordSubmit: ForgotPasswordFormProps["onSubmit"] = (
    email
  ) => {
    setForgotPasswordError("");
    forgotPasswordMutation.mutate(email, {
      onSuccess: () => setEmailSent(true),
      onError: (error) => setForgotPasswordError(error.message),
    });
  };

  const handleSwitchToForgot = () => {
    setMode("forgot");
    setForgotPasswordError("");
    setEmailSent(false);
  };

  const handleSwitchToLogin = () => {
    setMode("login");
    setLoginError("");
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="grid relative z-10 p-0 md:grid-cols-2 min-h-[400px]">
        {mode === "login" ? (
          <LoginForm
            onForgotPassword={handleSwitchToForgot}
            onSubmit={handleLoginSubmit}
            error={loginError}
            isLoading={loginMutation.isPending}
          />
        ) : (
          <ForgotPasswordForm
            onBack={handleSwitchToLogin}
            onSubmit={handleForgotPasswordSubmit}
            error={forgotPasswordError}
            isLoading={forgotPasswordMutation.isPending}
            isSuccess={emailSent}
          />
        )}

        <div className="hidden md:block absolute right-0 inset-y-[-24px] w-1/2 rounded-r-xl overflow-hidden">
          <Slideshow />
        </div>
      </CardContent>
    </Card>
  );
}
