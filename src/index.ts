import { Elysia } from 'elysia';
import swagger from '@elysiajs/swagger';
import cors from '@elysiajs/cors';
import { getEnvVariable } from '../utils/configs/variable';
import { LogController } from './log/log.controller';
import { EventEmitterPlugin } from '../utils/event/plugin';
import { errorPlugin } from '../utils/errors/plugin';
import { DatabasePluging } from './database';
const allowedOrigins = getEnvVariable('ALLOWED_ORIGINS', '').split(',');
const timeZone = getEnvVariable('TZ', 'Asia/Jakarta');

const app = new Elysia()
	.use(EventEmitterPlugin)
	.use(errorPlugin)
	.use(DatabasePluging)
	.get('/', () => 'Hello Elysia')
	.use(
		swagger({
			path: '/docs',
			documentation: {
				components: {
					securitySchemes: {
						bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
					},
				},
			},
		}),
	)

	/** masalah keamanan browser
	/** allow origin */
	.use(
		cors({
			origin: (req) => {
				if (getEnvVariable('NODE_ENV', 'production') !== 'production') return true;

				const originHeader = typeof req === 'string' ? req : req?.headers?.get?.('origin');

				if (!originHeader) return false;

				const url = new URL(originHeader);
				return allowedOrigins.includes(url.origin);
			},
			credentials: true,
		}),
	)

	/** untuk tampikan ke log waktu yang di butuhkan
	 ** untuk akses endpoint tertentu  */
	.onAfterHandle(({ path, request }) => {
		const timestamp = new Date().toLocaleString('id-ID', { timeZone }).replace(', ', ' ').replaceAll('.', ':');
		console.log(`${timestamp} :: ${request.method} :: ${path} :: ${(performance.now() / 100).toFixed(2)}ms`);
	})

	.use(LogController)
	.listen(+getEnvVariable('PORT', '3000'));

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
