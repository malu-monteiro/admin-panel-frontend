import { NavData } from "@/types";

export const initialData: NavData = {
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

export const defaultUser = {
  name: "User",
  email: "user@example.com",
  avatar: "/avatars/default.jpg",
};
