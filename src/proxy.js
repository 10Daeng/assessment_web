import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Routes that require admin authentication
const PROTECTED_PATHS = [
  '/api/admin/submissions',
  '/api/admin/chat',
];

// Routes that should NOT be protected (login/logout)
const PUBLIC_API_PATHS = [
  '/api/admin/auth/login',
  '/api/admin/auth/logout',
];

// Admin pages that should redirect to login if not authenticated
const ADMIN_PAGE_PATHS = ['/admin'];
const ADMIN_PAGE_EXCLUDE = ['/admin/login'];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Skip public API paths
  if (PUBLIC_API_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Skip the public submit endpoint (klien mengisi tes tanpa login)
  if (pathname === '/api/submit') {
    return NextResponse.next();
  }

  // Check protected API paths
  const isProtectedAPI = PROTECTED_PATHS.some(p => pathname.startsWith(p));
  const isAdminPage = ADMIN_PAGE_PATHS.some(p => pathname.startsWith(p)) &&
                      !ADMIN_PAGE_EXCLUDE.some(p => pathname === p);

  if (isProtectedAPI || isAdminPage) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      if (isProtectedAPI) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }
      // Redirect admin pages to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      if (isProtectedAPI) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      // Redirect admin pages to login if token invalid
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
