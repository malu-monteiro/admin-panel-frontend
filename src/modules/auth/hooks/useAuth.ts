import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { UseAuthOptions } from "@/types";

import { useAuthContext } from "./useAuthContext";

export function useAuth(options?: UseAuthOptions) {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;

    const isAuthenticated = !!user;
    const redirectToIfAuthenticated = options?.redirectToIfAuthenticated;
    const redirectToIfNotAuthenticated = options?.redirectToIfNotAuthenticated;

    if (isAuthenticated && redirectToIfAuthenticated) {
      navigate(redirectToIfAuthenticated, { replace: true });
    } else if (!isAuthenticated && redirectToIfNotAuthenticated) {
      navigate(redirectToIfNotAuthenticated, { replace: true });
    }
  }, [navigate, options, user, isLoading]);
}
