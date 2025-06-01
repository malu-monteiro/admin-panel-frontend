import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { NavUserProps } from "@/types";

import { useSidebar } from "@/components/ui/sidebar";

import { useAuthContext } from "@/modules/auth/hooks/useAuthContext";

export function useNavUser({
  initialAccountOpen = false,
  onAccountOpenChange,
}: Pick<NavUserProps, "initialAccountOpen" | "onAccountOpenChange">) {
  const { isMobile } = useSidebar();
  const [accountOpen, setAccountOpen] = useState(initialAccountOpen);
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setAccountOpen(open);
      onAccountOpenChange?.(open);
    },
    [onAccountOpenChange]
  );

  const handleLogout = useCallback(() => {
    logout();
    navigate("/sign-in");
  }, [logout, navigate]);

  return {
    isMobile,
    accountOpen,
    setAccountOpen,
    handleOpenChange,
    handleLogout,
  };
}
