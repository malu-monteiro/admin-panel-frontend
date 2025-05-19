import API from "./client";
import { User } from "@/types";

export async function fetchUserData(): Promise<User> {
  const response = await API.get("/auth/me");
  return {
    name: response.data.name,
    email: response.data.email,
  };
}
