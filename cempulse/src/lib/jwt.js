import crypto from 'crypto';

const base64url = (input) => Buffer.from(input).toString('base64url');

const SECRET = process.env.JWT_SECRET || 'dev_insecure_secret_change_me';

export function signJwt(payload, expiresInSeconds = 60 * 60 * 8) {
	const header = { alg: 'HS256', typ: 'JWT' };
	const now = Math.floor(Date.now() / 1000);
	const body = { ...payload, iat: now, exp: now + expiresInSeconds };
	const headerEncoded = base64url(JSON.stringify(header));
	const payloadEncoded = base64url(JSON.stringify(body));
	const data = `${headerEncoded}.${payloadEncoded}`;
	const signature = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
	return `${data}.${signature}`;
}

export function verifyJwt(token) {
	try {
		const [headerEncoded, payloadEncoded, signature] = token.split('.');
		if (!headerEncoded || !payloadEncoded || !signature) return null;
		const data = `${headerEncoded}.${payloadEncoded}`;
		const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
		if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
		const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString('utf8'));
		if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
		return payload;
	} catch (e) {
		return null;
	}
}

