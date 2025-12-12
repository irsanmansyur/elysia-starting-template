import Elysia from 'elysia';
import { HttpException } from '~/utils/plugins/errors/exception';
import { assetsService } from './service';

export const assetsRoutes = new Elysia({
	name: 'assets-routes',
	prefix: '/assets',
	detail: {
		tags: ['Assets Management'],
		summary: 'Assets Management',
		description: 'Assets Management',
	},
})
	.get('/template-image/:templateId', async ({ params }) => {
		const filePath = await assetsService.getTemplateImage(params.templateId);
		return Bun.file(filePath);
	})
	.get('/template-sound/:templateId', async ({ params }) => {
		const filePath = await assetsService.getTemplateSound(params.templateId);
		return Bun.file(filePath);
	})
	.get('/wedding-cover/:weddingId', async ({ params }) => {
		const filePath = await assetsService.getWeddingCover(params.weddingId);
		return Bun.file(filePath);
	})
	.get('/wedding-mempelai/:weddingId/:type', async ({ params }) => {
		const type = params.type as 'groom' | 'bride';
		if (type !== 'groom' && type !== 'bride') {
			throw new HttpException("Type must be 'groom' or 'bride'", 400);
		}
		const filePath = await assetsService.getMempelaiPhoto(params.weddingId, type);
		return Bun.file(filePath);
	})
	.get('/wedding-love-story/:weddingId/:index', async ({ params }) => {
		const filePath = await assetsService.getWeddingLoveStory(params.weddingId, +params.index);
		return Bun.file(filePath);
	});
