import { t } from 'elysia';
import { PaginateDto } from '~/utils/plugins/validators/general';

export default class AlbumModel {
	static getAlbumns = t.Object({
		...PaginateDto.properties,
	});
}
