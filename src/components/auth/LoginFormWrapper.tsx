import { useState } from "react";

import { useLoginForm } from "@/hooks/useLoginForm";
import { useForgotPassword } from "@/hooks/useForgotPassword";

import { Slideshow } from "./Slideshow";
import { LoginForm } from "./LoginForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

import { Card, CardContent } from "@/components/ui/card";

export function LoginFormWrapper() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const { loginMutation } = useLoginForm();
  const { forgotPasswordMutation } = useForgotPassword();

  const handleLoginSubmit = (credentials: {
    email: string;
    password: string;
  }) => {
    setLoginError("");
    loginMutation.mutate(credentials, {
      onError: (error) => setLoginError(error.message),
    });
  };

  const handleForgotPasswordSubmit = (email: string) => {
    setForgotPasswordError("");
    forgotPasswordMutation.mutate(email, {
      onSuccess: () => setEmailSent(true),
      onError: (error) => setForgotPasswordError(error.message),
    });
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="grid relative z-10 p-0 md:grid-cols-2">
        {!showForgotPassword ? (
          <LoginForm
            onForgotPassword={() => setShowForgotPassword(true)}
            onSubmit={handleLoginSubmit}
            error={loginError}
            isLoading={loginMutation.isPending}
          />
        ) : (
          <ForgotPasswordForm
            onBack={() => {
              setShowForgotPassword(false);
              setEmailSent(false);
              setForgotPasswordError("");
            }}
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
