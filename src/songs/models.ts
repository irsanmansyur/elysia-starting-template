import { t } from 'elysia';
import { PaginateDto } from '~/utils/plugins/validators/general';

export default class SongModel {
	static getSongs = t.Object({
		...PaginateDto.properties,
	});

	static getSongBySlug = t.Object({
		slug: t.String({ minLength: 1 })
	});

	static getTopSongs = t.Object({
		type: t.Union([t.Literal('view'), t.Literal('play'), t.Literal('download')]),
		limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 }))
	});
}
