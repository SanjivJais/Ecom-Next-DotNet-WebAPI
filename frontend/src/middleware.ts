import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DecodedUser } from './lib/interfaces';
import decodeToken from './lib/decodeToken';

const publicRoutes = ['/login', '/signup']; // Routes accessible only when logged out

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value || null;

    let user: DecodedUser | null = null;
    if (token) {
        user = decodeToken(token);
    }

    const { pathname } = new URL(request.url);

    // Public homepage
    if (!token && !user && pathname == '/') {
        return NextResponse.next();
    }

    // Redirect to public homepage if not authenticated
    if (!token && !user && pathname.startsWith('/u')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Redirect to login if not authenticated
    if (!token && !user && !publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to default homepage when authenticated and accessing public routes
    if ((token || user) && publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/u', request.url));
    }

    // Redirect to default home page if authenticated
    if ((token || user) && pathname === '/') {
        return NextResponse.redirect(new URL('/u', request.url));
    }

    // Admin routes
    if (token && user && pathname.startsWith('/admin') && user?.role !== 'Admin') {
        return NextResponse.redirect(new URL('/u', request.url));
    }

    // Vendor routes
    if (token && user && pathname.startsWith('/vendor') && user?.role !== 'Vendor') {
        return NextResponse.redirect(new URL('/u', request.url));
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
