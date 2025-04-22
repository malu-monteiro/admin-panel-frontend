import * as React from "react";
import { useState, useEffect } from "react";

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
import { NavUser } from "@/components/admin/NavUser";
import { SettingsIcon } from "lucide-react";

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelectItem?: (panelName: string) => void;
}

export function AppSidebar({ onSelectItem, ...props }: AppSidebarProps) {
  const [navData, setNavData] = useState(initialData);
  const [userEmail, setUserEmail] = useState("your@email.com");

  useEffect(() => {
    const stored = localStorage.getItem("email");
    if (stored) {
      setUserEmail(stored);
    }
  }, []);

  const user = {
    name: "Your User",
    email: userEmail,
    avatar: "/avatars/shadcn.jpg",
  };

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
    if (onSelectItem) {
      onSelectItem(itemTitle);
    }
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
        <NavUser user={user} />
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

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
  ],
};
