import Elysia from 'elysia';
import { EventEmitterPlugin } from './event';
import { logPlugin } from './log';
import { errorPlugin } from '~/utils/plugins/errors/plugin';
import { corsPluging } from '~/utils/plugins/cors';
import { throttlePluging } from './throttle';
import { DatabasePluging } from './database';

const app = new Elysia()
	.use(EventEmitterPlugin)
	.use(logPlugin)
	.use(errorPlugin)
	.use(
		throttlePluging({
			hits: {
				limit: 20,
				ttl: '3s',
				delay: '10s',
			},
		}),
	)
	.use(DatabasePluging)
	.use(corsPluging);
export default app;
