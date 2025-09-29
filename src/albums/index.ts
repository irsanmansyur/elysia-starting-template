import Elysia, { t } from 'elysia';
import { DatabasePluging } from '../database';
import { albums, artists, songs } from '../database/drizle/schema';
import { eq, and, inArray, count } from 'drizzle-orm';
import { paginate, generateMeta, searchCondition } from '~/utils/helpers/paginate';
import { PaginateDto } from '~/utils/plugins/validators/general';
import AlbumModel from './models';
import AlbumService from './service';
import { existsSync } from 'fs';
import path from 'path';

export const albumRoutes = new Elysia({
	name: 'ALBUMS',
})
	.use(DatabasePluging)
	.get(
		'/albums',
		async ({ query, DB }) => {
			const { data, meta } = await AlbumService.getAlbums(query);
			return { data, meta };
		},
		{
			query: AlbumModel.getAlbumns,
			detail: {
				tags: ['Albums'],
				summary: 'Get Albums with Pagination',
				description: 'Retrieve albums with pagination, search functionality, and includes artist and songs data',
			},
		},
	)
	.get(
		'/albums/:id/cover',
		async ({ params, set }) => {
			const { id } = params;
			const coverPath = path.join(process.cwd(), 'storage', 'covers', `${id}.webp`);
			const defaultPath = path.join(process.cwd(), 'storage', 'covers', '0.webp');

			// Check if specific cover exists, otherwise use default
			const imagePath = existsSync(coverPath) ? coverPath : defaultPath;

			// Set appropriate headers
			set.headers['Content-Type'] = 'image/webp';
			set.headers['Cache-Control'] = 'public, max-age=31536000';

			return Bun.file(imagePath);
		},
		{
			params: t.Object({
				id: t.String()
			}),
			detail: {
				tags: ['Albums'],
				summary: 'Get Album Cover Image',
				description: 'Get album cover image by ID, returns default 0.webp if not found',
			}
		}
	);
