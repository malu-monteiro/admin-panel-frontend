import { Title } from "@/components/Title";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

type AdminLayoutProps = {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  content: React.ReactNode;
};

export function AdminLayout({ sidebar, header, content }: AdminLayoutProps) {
  return (
    <>
      <Title>Admin Panel</Title>
      <SidebarProvider>
        {sidebar}
        <SidebarInset>
          {header}
          {content}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
