export function isAuthenticated(): boolean {
  const token = localStorage.getItem("authToken");
  return Boolean(token);
}
