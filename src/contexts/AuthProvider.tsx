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

  const loadUserData = async (token: string) => {
    try {
      const userData = await fetchUserData(token);
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      logout();
    } finally {
      setIsLoading(false);
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
        return;
      }

      await loadUserData(token);
    };

    verifyAuth();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !user) return;

    const interval = setInterval(async () => {
      if (!isTokenValid(token)) {
        logout();
      } else {
        await loadUserData(token);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async (token: string) => {
    localStorage.setItem("authToken", token);
    await loadUserData(token);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("requiresEmailUpdate");
    sessionStorage.clear();

    setUser(null);
    queryClient.removeQueries();
    queryClient.clear();

    window.location.href = "/sign-in";
  };

  const updateUser = async (newData: Partial<User>) => {
    if (user) {
      setUser((prev) => (prev ? { ...prev, ...newData } : null));

      const token = localStorage.getItem("authToken");
      if (token) await loadUserData(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
