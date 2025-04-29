import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuthOptions } from "@/types";
import { useAuthContext } from "./useAuthContext";

export function useAuth(options?: UseAuthOptions) {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;

    const isAuthenticated = !!user;

    if (isAuthenticated && options?.redirectToIfAuthenticated) {
      navigate(options.redirectToIfAuthenticated, { replace: true });
    }

    if (!isAuthenticated && options?.redirectToIfNotAuthenticated) {
      navigate(options.redirectToIfNotAuthenticated, { replace: true });
    }
  }, [navigate, options, user, isLoading]);
}
