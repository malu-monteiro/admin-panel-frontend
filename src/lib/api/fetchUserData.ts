import { User } from "@/types";

export async function fetchUserData(token: string): Promise<User> {
  try {
    const response = await fetch("http://localhost:3000/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar usuário");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);

    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    if (name && email) {
      return {
        name,
        email,
        avatar: "",
      };
    }

    throw error;
  }
}
