import { User } from "@/types";

import { useEffect, useState } from "react";

import { AppSidebar } from "@/components/admin/AppSidebar";
import { AdminLayout } from "@/components/admin/_layout/AdminLayout";
import { AdminHeader } from "@/components/admin/_layout/AdminHeader";
import { AdminContent } from "@/components/admin/_layout/AdminContent";

import { useAuthContext } from "@/hooks/useAuthContext";

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
