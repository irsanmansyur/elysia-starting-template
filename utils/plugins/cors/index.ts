import cors from '@elysiajs/cors';
import { Config } from '~/utils/configs';
const allowedOrigins = Config.App.env('ALLOWED_ORIGINS', '').split(',');

export const corsPluging = cors({
	origin: (req) => {
		if (!Config.App.isProduction) return true;

		const originHeader = typeof req === 'string' ? req : req?.headers?.get?.('origin');

		if (!originHeader) return false;

		const url = new URL(originHeader);
		return allowedOrigins.includes(url.origin);
	},
	credentials: true,
});
