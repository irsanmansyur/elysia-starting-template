export function getClientIP(headers: Headers): string {
	const forwarded = headers.get('x-forwarded-for');
	if (forwarded) {
		// Ambil IP pertama dari list jika proxy
		return forwarded.split(',')[0].trim();
	}

	// @ts-ignore: Bun specific
	return request.socket?.remoteAddress || 'unknown';
}
