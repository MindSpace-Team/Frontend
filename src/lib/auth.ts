export function getAuthHeaders(): { Authorization?: string } {
  const token = localStorage.getItem("jwt-token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
