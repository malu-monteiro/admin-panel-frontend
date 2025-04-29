import { AppSidebar } from "@/components/admin/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

import { BusinessHours } from "@/components/admin/BusinessHours";
import { ManageServices } from "@/components/admin/ManageServices";
import { ManageDates } from "@/components/admin/ManageDates";
import { ActiveBlocks } from "@/components/admin/ActiveBlocks";

import { Title } from "@/components/Title";

import { useAuthContext } from "@/hooks/useAuthContext";
import { User } from "@/types";

export function AdminPanel() {
  const { user, isLoading, updateUser } = useAuthContext();

  const [showUpdateEmailModal, setShowUpdateEmailModal] = useState(false);
  const [activePanel, setActivePanel] = useState("Business Hours");

  const safeUser = user || {
    name: "Admin",
    email: "admin@exemplo.com",
    avatar: "/avatars/default.jpg",
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

  const handleMenuClick = (panelName: string) => {
    setActivePanel(panelName);
  };

  const renderActiveSection = () => {
    switch (activePanel) {
      case "Business Hours":
        return <BusinessHours />;
      case "Manage Services":
        return <ManageServices />;
      case "Manage Dates":
        return <ManageDates />;
      case "Active Blocks":
        return <ActiveBlocks />;
      default:
        return <div>Select item</div>;
    }
  };

  return (
    <>
      <Title>Admin Panel</Title>
      <SidebarProvider>
        <AppSidebar
          onSelectItem={handleMenuClick}
          user={safeUser}
          initialAccountOpen={showUpdateEmailModal}
          onAccountOpenChange={setShowUpdateEmailModal}
          onUserUpdate={handleUserUpdate}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Admin Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{activePanel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {renderActiveSection()}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
