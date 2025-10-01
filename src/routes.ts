import app from '~/utils/plugins/app';

export const routes = app
	.get('/', () => 'Hello Kamu')
	.get('/health', () => 'OK', {
		throttle: {
			hits: {
				limit: 5,
				ttl: '3s',
				delay: '3s',
			},
		},
	});
