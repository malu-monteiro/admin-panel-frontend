import { Navigate, useLocation } from "react-router-dom";

import { useAuthContext } from "@/hooks/useAuthContext";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
