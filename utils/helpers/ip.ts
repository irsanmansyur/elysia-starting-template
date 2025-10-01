import { Elysia } from 'elysia';

export function getClientIP(request: Request, server?: any): string {
	const sock = server?.requestIP?.(request);
	if (sock?.address) {
		return sock.address; // ambil langsung "127.0.0.1" atau "::1"
	}

	const headers = request.headers;
	const xff = headers.get('x-forwarded-for');
	if (xff) return xff.split(',')[0].trim();

	return headers.get('cf-connecting-ip') ?? headers.get('fastly-client-ip') ?? headers.get('x-real-ip') ?? '';
}
