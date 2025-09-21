import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth_token')?.value;
	const payload = token ? verifyJwt(token) : null;
	if (!payload) {
		return NextResponse.json({ user: null }, { status: 401 });
	}
	return NextResponse.json({ user: { username: payload.sub, role: payload.role, allowed: payload.allowed || null } }, { status: 200 });
}
