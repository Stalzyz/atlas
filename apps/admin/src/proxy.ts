import { NextResponse, NextRequest } from 'next/server';

// Matches static files and Next.js internals
const PUBLIC_FILE = /\.(.*)$/;

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow static files, api routes, and public auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    PUBLIC_FILE.test(pathname) ||
    pathname === '/login'
  ) {
    return NextResponse.next();
  }

  // 2. Check for our custom session token
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    // Redirect to login if unauthenticated
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
