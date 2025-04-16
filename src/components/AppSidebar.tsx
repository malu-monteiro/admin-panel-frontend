import * as React from "react";
import { useState } from "react";

import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelectItem?: (panelName: string) => void;
}

const initialData = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
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

export function AppSidebar({ onSelectItem, ...props }: AppSidebarProps) {
  const [navData, setNavData] = useState(initialData);

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
        <VersionSwitcher
          versions={navData.versions}
          defaultVersion={navData.versions[0]}
        />
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
    </Sidebar>
  );
}
