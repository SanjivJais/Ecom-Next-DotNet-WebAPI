import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected and public routes
const protectedRoutes = ['/profile', '/admin']; // Routes accessible only when logged in
const publicRoutes = ['/login', '/signup']; // Routes accessible only when logged out

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value || null;

    const { pathname } = request.nextUrl;

    // If the user is trying to access a protected route without a token, redirect to login
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // If the user is trying to access a public route (e.g., /login or /signup) with a token, redirect to homepage
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        if (token) {
            const homeUrl = new URL('/', request.url);
            return NextResponse.redirect(homeUrl);
        }
    }

    // Allow the request to proceed for all other cases
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/login/:path*',
        '/signup/:path*',
        '/admin/:path*'
    ], // Match paths to apply the middleware
};
