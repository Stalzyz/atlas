import { API_URL } from "../api";

export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800";
  if (path.startsWith("http")) return path;
  // Ensure path starts with a slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
}
