import { Elysia } from 'elysia';
import { EventEmitter } from 'events';
import { getEnv } from '~/utils/helpers/app';
import { fetchWithTimeout } from '~/utils/helpers/fetch';

export const eventEmitter = new EventEmitter();
eventEmitter.on('logger.create-external', async ({ message, level, stack }: APP.LOG.Create) => {
	// return fetchWithTimeout(getEnv('LOG_API'), {
	// 	method: 'POST',
	// 	body: JSON.stringify({
	// 		message,
	// 		service: getEnv('APP_NAME', 'ELYSIA STARTER'),
	// 		level,
	// 		meta: stack,
	// 	}),
	// }).catch((e) => {
	// 	console.error('Error Create Log!', e);
	// });
});

export const EventEmitterPlugin = new Elysia({
	name: 'event-emitter',
});
