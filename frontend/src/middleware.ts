import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/profile'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value || null; // Retrieve token from cookies
    // Check if the current path is protected
    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        if (!token) {
            // Redirect to login page if no token is found
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*'], // Match paths to apply the middleware
};
