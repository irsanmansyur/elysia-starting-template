import Elysia, { t } from 'elysia';
import { DatabasePluging } from '../database';
import SongModel from './models';
import SongService from './service';
import { existsSync } from 'fs';
import path from 'path';

export const songRoutes = new Elysia({
	name: 'SONGS',
})
	.use(DatabasePluging)
	.get(
		'/songs',
		async ({ query }) => {
			const { data, meta } = await SongService.getSongs(query);
			return { data, meta };
		},
		{
			query: SongModel.getSongs,
			detail: {
				tags: ['Songs'],
				summary: 'Get Songs with Pagination',
				description: 'Retrieve songs with pagination, search functionality, and includes album and artist data',
			},
		},
	)

	.get(
		'/songs/cover/:id',
		async ({ params, set }) => {
			const { id } = params;
			let imagePath: string;

			// Check if song cover exists
			const songCoverPath = path.join(process.cwd(), 'storage', 'cover', 'song', `${id}.webp`);
			if (existsSync(songCoverPath)) {
				imagePath = songCoverPath;
			} else {
				// Get song data to find album ID
				const songData = await SongService.getSongById(id);
				if (songData && songData.albumId) {
					// Try to get album cover
					const albumCoverPath = path.join(process.cwd(), 'storage', 'covers', `${songData.albumId}.webp`);
					imagePath = existsSync(albumCoverPath) ? albumCoverPath : path.join(process.cwd(), 'storage', 'covers', '0.webp');
				} else {
					// Use default cover
					imagePath = path.join(process.cwd(), 'storage', 'covers', '0.webp');
				}
			}

			set.headers['Content-Type'] = 'image/webp';
			set.headers['Cache-Control'] = 'public, max-age=31536000';
			return Bun.file(imagePath);
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			detail: {
				tags: ['Songs'],
				summary: 'Get Song Cover Image',
				description: 'Get song cover image by ID. Falls back to album cover, then default 0.webp if not found',
			},
		},
	)
	.get(
		'/songs/:slug',
		async ({ params, set }) => {
			const { slug } = params;
			const songData = await SongService.getSongBySlug(slug);

			if (!songData) {
				set.status = 404;
				return { message: 'Song not found' };
			}

			return { data: songData };
		},
		{
			params: t.Object({
				slug: t.String({ minLength: 1 }),
			}),
			detail: {
				tags: ['Songs'],
				summary: 'Get Song by Slug',
				description: 'Retrieve a specific song by its slug with album and artist information',
			},
		},
	)
	.get(
		'/songs/top',
		async ({ query }) => {
			const { data, total } = await SongService.getTopSongs(query);
			return { data, total };
		},
		{
			query: SongModel.getTopSongs,
			detail: {
				tags: ['Songs'],
				summary: 'Get Top Songs',
				description: 'Retrieve top songs by views, plays, or downloads with their total counts',
			},
		},
	);
