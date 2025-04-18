import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ['/dashboard','/profile','/settings'] // Add your protected routes here
const beforeLoginRoutes = ['/login', '/signup', '/forgot-password','/reset-password'] // Add your before login routes here

export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone();
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