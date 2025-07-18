import { Elysia } from 'elysia';
import { EventEmitter } from 'events';
import { fetchWithTimeout } from '../../helpers/helper';
import { Config } from '../../configs/variable';

export const eventEmitter = new EventEmitter();
eventEmitter.on('logger.create-external', async ({ message, level, stack }: APP.LOG.Create) => {
	return fetchWithTimeout(Config.App.env('LOG_API'), {
		method: 'POST',
		body: JSON.stringify({
			message,
			service: Config.App.env('APP_NAME', 'ELYSIA STARTER'),
			level,
			meta: stack,
		}),
	}).catch((e) => {
		console.error('Error Create Log!', e);
	});
});

export const EventEmitterPlugin = new Elysia({
	name: 'event-emitter',
});
