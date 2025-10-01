import { Elysia } from 'elysia';
import { getClientIP } from '../../helpers/ip';
import { LOG } from './helper';

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
				transform: async ({ request, body, query, server }) => {
					const ip = getClientIP(request, server);
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
