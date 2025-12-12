import { eq } from 'drizzle-orm';
import { fileHelpers } from '~/utils/helpers/file';
import { DB } from '~/utils/plugins/database';
import { WeddingTemplateModel } from '~/utils/plugins/database/mongoose/schema';
import { templates } from '~/utils/plugins/database/schema';
import { HttpException } from '~/utils/plugins/errors/exception';

export const assetsService = {
	async getTemplateImage(templateId: string) {
		const template = await DB.Postgres.query.templates.findFirst({
			where: eq(templates.id, templateId),
		});
		if (!template) throw new HttpException('Template not found', 404);
		const filePath = fileHelpers.fileExists(template.thumbnail);
		if (!filePath) throw new HttpException('File not found', 404);
		return filePath;
	},
	async getTemplateSound(templateId: string) {
		const template = await DB.Postgres.query.templates.findFirst({
			where: eq(templates.id, templateId),
		});
		if (!template) throw new HttpException('Template not found', 404);
		const filePath = fileHelpers.fileExists(`templates/sounds/${template.id}`);
		if (!filePath) throw new HttpException('File not found', 404);
		return filePath;
	},

	async getWeddingCover(weddingId: string) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) throw new HttpException('Wedding not found', 404);
		const filePath = fileHelpers.fileExists(wedding.coverPhoto);
		if (!filePath) throw new HttpException('File not found', 404);
		return filePath;
	},

	async getMempelaiPhoto(weddingId: string, type: 'groom' | 'bride') {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) throw new HttpException('Wedding not found', 404);
		const photoUrl = type === 'groom' ? wedding.mempelai.groom.photoUrl : wedding.mempelai.bride.photoUrl;
		const filePath = fileHelpers.fileExists(photoUrl);
		if (!filePath) throw new HttpException('File not found', 404);
		return filePath;
	},
	async getWeddingLoveStory(weddingId: string, index: number) {
		const wedding = await WeddingTemplateModel.findById(weddingId);
		if (!wedding) throw new HttpException('Wedding not found', 404);
		if (index < 0 || index >= wedding.loveStory.length) {
			throw new HttpException('Love story index out of range', 400);
		}
		const photoUrl = wedding.loveStory[index].image;
		if (!photoUrl) {
			throw new HttpException('File not found', 404);
		}

		const filePath = fileHelpers.fileExists(photoUrl);
		if (!filePath) throw new HttpException('File not found', 404);

		return filePath;
	},
};
