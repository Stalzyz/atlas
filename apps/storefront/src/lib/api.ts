/**
 * Centralized API configuration for the Atlas Storefront.
 * Ensures we always fall back to the production API domain if environment variables are missing.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? "http://localhost:6005" : "https://api.grekam.in");

export const getApiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};
