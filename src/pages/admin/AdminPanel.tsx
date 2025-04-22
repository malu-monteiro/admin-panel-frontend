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
import { useState } from "react";

import { BusinessHours } from "@/components/admin/BusinessHours";
import { ManageServices } from "@/components/admin/ManageServices";
import { ManageDates } from "@/components/admin/ManageDates";
import { ActiveBlocks } from "@/components/admin/ActiveBlocks";

import { Title } from "@/components/Title";

import { useAuth } from "@/hooks/useAuth";

export function AdminPanel() {
  useAuth({ redirectToIfNotAuthenticated: "/sign-in" });

  const [activePanel, setActivePanel] = useState("Business Hours");
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
        return <div>Selecione um item do menu</div>;
    }
  };

  return (
    <>
      <Title>Panel</Title>
      <SidebarProvider>
        <AppSidebar onSelectItem={handleMenuClick} />
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
