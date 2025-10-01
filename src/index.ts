import swagger from '@elysiajs/swagger';
import { routes } from './routes';
import { port } from '~/utils/configs';

routes
	.use(
		swagger({
			path: '/dokumentasi',
			documentation: {
				components: {
					securitySchemes: {
						bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
					},
				},
			},
		}),
	)
	.onStart(({ server }) => {
		console.log(`🦊 Elysia is running at http://${server?.hostname}:${server?.port}`);
	})
	.listen(+port);
