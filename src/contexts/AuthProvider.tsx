import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import { fetchUserData } from "@/lib/api/fetchUserData";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await fetchUserData(token);
        setUser(userData);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("name", userData.name);
      } catch (error) {
        console.error("Failed to verify token:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("requiresEmailUpdate");

    setUser(null);
    queryClient.clear();
  };

  const updateUser = (newData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...newData } : null));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
