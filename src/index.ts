import swagger from '@elysiajs/swagger';
import { Config } from '../utils/configs';
import { routes } from './routes';

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
	.listen(+Config.App.env('PORT', '3000'));
