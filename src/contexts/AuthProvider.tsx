import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import { fetchUserData } from "@/lib/api/fetchUserData";
import { AuthContext } from "./AuthContext";

import { jwtDecode } from "jwt-decode";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const isTokenValid = (token: string) => {
    try {
      const decoded = jwtDecode(token) as { exp: number };
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      if (!isTokenValid(token)) {
        console.warn("Expired token detected on loading");
        logout();
        setIsLoading(false);
        return;
      }

      try {
        const userData = await fetchUserData(token);
        setUser(userData);
      } catch (error) {
        console.error("Failed to verify token:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !user) return;

    const interval = setInterval(() => {
      if (!isTokenValid(token)) {
        logout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (token: string, userData: User) => {
    localStorage.setItem("authToken", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
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
