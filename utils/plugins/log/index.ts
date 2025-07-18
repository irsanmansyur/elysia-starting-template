import { Elysia } from 'elysia';
import { getClientIP } from '../../helpers/ip';
import { LOG } from './helper';
import { Config } from '~/utils/configs';
const timeZone = Config.App.env('TZ', 'Asia/Jakarta');

export const logPlugin = new Elysia({
	name: 'LOG',
})
	.derive({ as: 'global' }, ({}) => {
		return {
			_start: performance.now(),
		};
	})
	.onAfterResponse({ as: 'global' }, ({ path, request, _start }) => {
		const duration = (performance.now() - _start).toFixed(2);
		const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }).replace(', ', ' ').replaceAll('.', ':');
		console.log(`${timestamp} :: ${request.method} :: ${path} :: ${duration}ms`);
	})

	.macro({
		createIncominReq: ({ external, message }: APP.LOG.Incoming) => {
			return {
				transform: async ({ request, body, query }) => {
					const ip = getClientIP(request.headers);
					const msg = `${request.method} :: ${request.url} :: ${ip} :: ${message || `Incoming Request`}`;

					if (external) {
						/** jika method POST,PUT, PATCH catat body */
						const logData: APP.LOG.ExPayload = {
							service: 'API',
							message: msg,
							level: 'info',
							meta: { headers: request.headers, query, body: request.method !== 'GET' ? body : undefined },
						};
						LOG.createExternal(logData);
					} else {
						LOG.createLokal(msg);
					}
				},
			};
		},
	});
