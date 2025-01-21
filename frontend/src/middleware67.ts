import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import decodeToken from './lib/decodeToken';

// Define protected routes for different roles
const protectedRoutes = {
    admin: ['/admin'],
    vendor: ['/vendor'],
    user: ['/u'], // default user path
};
const publicRoutes = ['/login', '/signup', '/']; // Routes accessible only when logged out

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value || null;
    const { pathname } = request.nextUrl;

    // Decode the token if available
    const user = token ? decodeToken(token) : null;


    // Handle protected routes
    if (
        protectedRoutes.admin.some(route => pathname.startsWith(route)) ||
        protectedRoutes.vendor.some(route => pathname.startsWith(route)) ||
        protectedRoutes.user.some(route => pathname.startsWith(route))
    ) {
        // If no token, redirect to login
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        // If token exists, check the role
        if (user) {
            if (protectedRoutes.admin.some(route => pathname.startsWith(route)) && user.role !== 'Admin') {
                const unauthorizedUrl = new URL('/unauthorized', request.url);
                return NextResponse.redirect(unauthorizedUrl);
            }

            if (protectedRoutes.vendor.some(route => pathname.startsWith(route)) && user.role !== 'Vendor') {
                const unauthorizedUrl = new URL('/unauthorized', request.url);
                return NextResponse.redirect(unauthorizedUrl);
            }

            if (protectedRoutes.user.some(route => pathname.startsWith(route)) && user.role !== 'User') {
                const unauthorizedUrl = new URL('/unauthorized', request.url);
                return NextResponse.redirect(unauthorizedUrl);
            }
        }
    }

    // Redirect logged-in users trying to access public routes
    if (publicRoutes.some(route => pathname.startsWith(route)) && token) {
        const userHomeUrl = new URL('/u', request.url);
        return NextResponse.redirect(userHomeUrl);
    }

    // Prevent infinite loops by excluding the unauthorized route
    if (pathname.startsWith('/unauthorized')) {
        return NextResponse.next();
    }

    // Allow the request to proceed for all other cases
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login/:path*',
        '/signup/:path*',
        '/admin/:path*',
        '/vendor/:path*',
        '/u/:path*',
    ], // Match paths to apply the middleware
};
