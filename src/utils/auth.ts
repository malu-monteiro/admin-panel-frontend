import { jwtDecode } from "jwt-decode";

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token) as { exp: number };
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
