import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export function middleware(request) {
	const { nextUrl, cookies } = request;
	const isMonitor = nextUrl.pathname.startsWith('/monitor');
	if (!isMonitor) return NextResponse.next();
	const token = cookies.get('auth_token')?.value;
	const payload = token ? verifyJwt(token) : null;
	if (!payload) {
		const url = new URL('/login', request.url);
		url.searchParams.set('redirect', nextUrl.pathname);
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/monitor/:path*']
};

