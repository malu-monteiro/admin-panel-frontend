import { Navigate, useLocation } from "react-router-dom";

import { useAuthContext } from "@/hooks/useAuthContext";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}
