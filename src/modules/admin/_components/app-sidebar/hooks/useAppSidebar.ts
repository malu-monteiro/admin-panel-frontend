import { useState } from "react";

import type { AppSidebarProps, NavData } from "@/types";

import { useAuthContext } from "@/modules/auth/hooks/useAuthContext";

import {
  defaultUser,
  initialData,
} from "@/modules/admin/_components/app-sidebar/utils/sidebarData";

export function useAppSidebar(userProp?: AppSidebarProps["user"]) {
  const [navData, setNavData] = useState<NavData>(initialData);
  const { user: authUser } = useAuthContext();

  const resolvedUser = userProp || authUser || defaultUser;

  const handleItemClick = (
    groupIndex: number,
    itemIndex: number,
    itemTitle: string,
    onSelectItem?: (itemTitle: string) => void
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

  return {
    navData,
    setNavData,
    resolvedUser,
    handleItemClick,
  };
}
