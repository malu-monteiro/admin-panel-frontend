import { useState } from "react";

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

import { NavUser } from "./NavUser";

import { AppSidebarProps } from "@/types";
import { useAuthContext } from "@/hooks/useAuthContext";

export function AppSidebar({
  onSelectItem,
  user,
  initialAccountOpen,
  onAccountOpenChange,
  onUserUpdate,
  ...props
}: AppSidebarProps) {
  const [navData, setNavData] = useState(initialData);
  const { user: authUser } = useAuthContext();

  const defaultUser = {
    name: "Usuário",
    email: "usuario@exemplo.com",
    avatar: "/avatars/default.jpg",
  };

  const resolvedUser = user || authUser || defaultUser;

  const handleItemClick = (
    groupIndex: number,
    itemIndex: number,
    itemTitle: string
  ) => {
    setNavData((prevData) => {
      const newData = { ...prevData };
      newData.navMain.forEach((group) => {
        group.items.forEach((item) => {
          item.isActive = false;
        });
      });

      newData.navMain[groupIndex].items[itemIndex].isActive = true;
      return newData;
    });

    onSelectItem?.(itemTitle);
  };

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
                        handleItemClick(groupIndex, itemIndex, item.title)
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

const initialData = {
  navMain: [
    {
      title: "Building Your Schedule",
      items: [
        {
          title: "Business Hours",
          url: "#",
          isActive: true,
        },
        {
          title: "Manage Services",
          url: "#",
        },
        {
          title: "Manage Dates",
          url: "#",
        },
        {
          title: "Active Blocks",
          url: "#",
        },
      ],
    },
  ],
};
