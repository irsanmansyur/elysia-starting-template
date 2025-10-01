import cors from '@elysiajs/cors';
import { allowedOrigins, isProduction } from '~/utils/configs';

export const corsPluging = cors({
	origin: (req) => {
		if (!isProduction) return true;

		const originHeader = typeof req === 'string' ? req : req?.headers?.get?.('origin');

		if (!originHeader) return false;

		const url = new URL(originHeader);
		return allowedOrigins.includes(url.origin);
	},
	credentials: true,
});
