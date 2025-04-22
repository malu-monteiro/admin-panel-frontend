import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type UseAuthOptions = {
  // exemplo: "/admin-panel"
  redirectToIfAuthenticated?: string;
  // exemplo: "/sign-in"
  redirectToIfNotAuthenticated?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;

    if (isAuthenticated && options?.redirectToIfAuthenticated) {
      navigate(options.redirectToIfAuthenticated, { replace: true });
    }

    if (!isAuthenticated && options?.redirectToIfNotAuthenticated) {
      navigate(options.redirectToIfNotAuthenticated, { replace: true });
    }
  }, [navigate, options]);
}
