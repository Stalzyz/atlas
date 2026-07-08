import { API_URL } from "../api";

/**
 * Returns the public-facing base URL for static assets (images, uploads).
 * 
 * Critical: For SSR/SSG, API_URL may be http://localhost:6005 (internal network).
 * Images served to browsers MUST use the public API domain.
 * We separate "public asset base" from the internal API_URL used for data fetching.
 */
function getPublicAssetBase(): string {
  // In production, always use the public API domain for images
  if (process.env.NODE_ENV === "production") {
    return "https://api.grekam.in";
  }
  // In development, use whatever API_URL is configured
  return API_URL;
}

export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800";
  if (path.startsWith("http")) return path;
  // Ensure path starts with a slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicAssetBase()}${cleanPath}`;
}
