// middleware.ts]
import { getValidSubdomain } from '@/utils/subdomain';
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files

const protectedRoutes = ['/dashboard','/profile','/settings'] // Add your protected routes here
const beforeLoginRoutes = ['/login', '/signup', '/forgot-password','/reset-password'] // Add your before login routes here

export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone();
  // if valid subdomain (uid), rewrite to /[uid]/pathname
  // all /[uid] routes are public and read-only
  const host = req.headers.get('host');
  const subdomain = getValidSubdomain(host);
  if (subdomain) {
    // Subdomain available, rewriting
    console.log(`>>> Rewriting: ${url.pathname} to /users/${subdomain}${url.pathname}`);
    url.pathname = `/users/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  // TODO: get session cookie from server
  const sessionCookie = getSessionCookie(req);
  // TODO: if no valid cookie and is protected route, redirect to login
  if (!sessionCookie && protectedRoutes.some(route => url.pathname.startsWith(route))) {
    console.log(`>>> Redirecting to /login`);
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // TODO: if valid cookie and is beforeLogin route, redirect to dashboard
  if (sessionCookie && beforeLoginRoutes.some(route => url.pathname.startsWith(route))) {
    console.log(`>>> Redirecting to /dashboard`);
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}