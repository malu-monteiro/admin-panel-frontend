import { NavUser } from "./NavUser";

import type { AppSidebarProps } from "@/types";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAppSidebar } from "@/hooks/useAppSidebar";

export function AppSidebar({
  onSelectItem,
  user,
  initialAccountOpen,
  onAccountOpenChange,
  onUserUpdate,
  ...props
}: AppSidebarProps) {
  const { navData, resolvedUser, handleItemClick } = useAppSidebar(user);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <span className="text-base font-semibold">Welcome!</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navData.navMain.map((group, groupIndex) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      onClick={() =>
                        handleItemClick(
                          groupIndex,
                          itemIndex,
                          item.title,
                          onSelectItem
                        )
                      }
                    >
                      <a href="#">{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={resolvedUser}
          initialAccountOpen={initialAccountOpen}
          onAccountOpenChange={onAccountOpenChange}
          onUserUpdate={onUserUpdate}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
