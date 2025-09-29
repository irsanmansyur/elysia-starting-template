import { generateMeta, paginate, searchCondition } from '~/utils/helpers/paginate';
import AlbumModel from './models';
import { DB } from '../database';
import { albums, artists, albumArtists } from '../database/drizle/schema';
import { count, eq } from 'drizzle-orm';

export default abstract class AlbumService {
	static instance: AlbumService;
	static async getAlbums(query: typeof AlbumModel.getAlbumns.static) {
		const { offset, limit, page } = paginate(query);
		const searchConditions = searchCondition(query.search, [albums.title, artists.name]);
		const [result] = await DB.Postgres.select({ count: count() }).from(albums).leftJoin(albumArtists, eq(albums.id, albumArtists.albumId)).leftJoin(artists, eq(albumArtists.artistId, artists.id)).where(searchConditions);

		const albumsData = await DB.Postgres.query.albums.findMany({
			where: searchConditions,
			limit,
			offset,
			with: {
				artists: {
					with: {
						artist: true
					}
				},
				songs: {
					with: {
						artists: {
							with: {
								artist: true
							}
						}
					}
				},
			},
			orderBy: (alb, { desc }) => [desc(alb.id)],
		});

		// Transform data to flatten artist arrays
		const transformedData = albumsData.map(album => ({
			...album,
			artists: album.artists.map(aa => aa.artist),
			songs: album.songs.map(song => ({
				...song,
				artists: song.artists.map(sa => sa.artist)
			}))
		}));

		return { data: transformedData, meta: generateMeta(result.count, page, limit) };
	}
}
