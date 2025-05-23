import { jwtDecode } from "jwt-decode";

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token) as { exp: number };
    return decoded.exp * 6000 > Date.now();
  } catch {
    return false;
  }
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return "The password must be at least 6 characters long";
  }

  if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
    return "Must contain letters and numbers";
  }
  return null;
}

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    try {
      const errorData = JSON.parse(error.message);
      return errorData.message || errorData.error || error.message;
    } catch {
      return error.message;
    }
  }
  return "An unknown error ocurred";
}
