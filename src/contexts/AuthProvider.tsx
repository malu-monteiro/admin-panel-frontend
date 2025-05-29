import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { User } from "@/types";
import { AuthContext } from "./AuthContext";
import { fetchUserData } from "@/lib/api/fetchUserData";

import { jwtDecode } from "jwt-decode";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const isTokenValid = (token: string) => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await fetchUserData();
      setUser(userData);
    } catch {
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
        logout();
        return;
      }

      await loadUserData();
    };

    verifyAuth();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("authToken", token);
    await loadUserData();
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    setUser(null);
    queryClient.clear();
    window.location.href = "/sign-in";
  };

  const updateUser = async (newData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...newData } : null));

    await loadUserData();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
