import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isLoginPage = request.nextUrl.pathname.startsWith('/login');

    if (!isLoginPage) {
        const sessionCookie = request.cookies.get('admin_session')?.value;

        if (sessionCookie !== 'authenticated') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
