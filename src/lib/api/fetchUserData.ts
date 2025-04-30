import { User } from "@/types";

export async function fetchUserData(token: string): Promise<User> {
  try {
    if (!token) {
      throw new Error("Token not provided");
    }

    const response = await fetch("http://localhost:3000/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error in response:", response.status, errorData);
      throw new Error(errorData.error || "User search error");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}
