import type { User } from "@/types";

import { useEffect, useState } from "react";

import { AdminContent } from "@/modules/admin";
import { AdminLayout } from "@/modules/admin/_layout/AdminLayout";
import { AdminHeader } from "@/modules/admin/_layout/AdminHeader";
import { useAuthContext } from "@/modules/auth/hooks/useAuthContext";
import { AppSidebar } from "@/modules/admin/_components/app-sidebar";

export function AdminPanel() {
  const { user, isLoading, updateUser } = useAuthContext();
  const [showUpdateEmailModal, setShowUpdateEmailModal] = useState(false);
  const [activePanel, setActivePanel] = useState("Business Hours");

  const safeUser = user || {
    name: "Admin",
    email: "admin@example.com",
  };

  useEffect(() => {
    if (isLoading) return;

    if (localStorage.getItem("requiresEmailUpdate") === "true") {
      setShowUpdateEmailModal(true);
      localStorage.removeItem("requiresEmailUpdate");
    }
  }, [isLoading]);

  const handleUserUpdate = (newData: Partial<User>) => {
    updateUser(newData);
  };

  return (
    <AdminLayout
      sidebar={
        <AppSidebar
          onSelectItem={setActivePanel}
          user={safeUser}
          initialAccountOpen={showUpdateEmailModal}
          onAccountOpenChange={setShowUpdateEmailModal}
          onUserUpdate={handleUserUpdate}
        />
      }
      header={<AdminHeader activePanel={activePanel} />}
      content={<AdminContent activePanel={activePanel} />}
    />
  );
}
