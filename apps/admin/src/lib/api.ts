/**
 * Authenticated API client for Atlas Admin.
 *
 * The AuthGuard accepts BOTH:
 *   1. Authorization: Bearer <token>  (in-memory JWT)
 *   2. Cookie: admin_token=<token>    (HttpOnly cookie, set on login)
 *
 * Using `credentials: 'include'` ensures the browser sends the admin_token cookie
 * on all cross-origin requests to api.atlas.in, even if the in-memory token is null.
 */

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6005').replace(/\/$/, '');

/**
 * Drop-in replacement for fetch() that always authenticates via cookie + optional Bearer token.
 */
export async function apiFetch(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<Response> {
  const { token, headers: rawHeaders, ...rest } = options;

  const headers: Record<string, string> = { ...(rawHeaders as Record<string, string>) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    credentials: 'include',
  });
}
