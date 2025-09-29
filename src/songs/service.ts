import { generateMeta, paginate, searchCondition } from '~/utils/helpers/paginate';
import SongModel from './models';
import { DB } from '../database';
import { songs, albums, artists, songArtists, albumArtists } from '../database/drizle/schema';
import { count, eq, sql } from 'drizzle-orm';

export default abstract class SongService {
	static instance: SongService;

	static async getSongs(query: typeof SongModel.getSongs.static) {
		const { offset, limit, page } = paginate(query);
		const searchConditions = searchCondition(query.search, [songs.title, albums.title, artists.name]);
		const [result] = await DB.Postgres.select({ count: count() })
			.from(songs)
			.leftJoin(albums, eq(songs.albumId, albums.id))
			.leftJoin(songArtists, eq(songs.id, songArtists.songId))
			.leftJoin(artists, eq(songArtists.artistId, artists.id))
			.where(searchConditions);

		const songsData = await DB.Postgres.query.songs.findMany({
			where: searchConditions,
			limit,
			offset,
			with: {
				album: true,
				artists: {
					with: {
						artist: true,
					},
				},
			},
			orderBy: (song, { desc }) => [desc(song.id)],
		});

		// Transform data to flatten artist arrays
		const transformedData = songsData.map((song) => ({
			...song,
			artists: song.artists.map((sa) => sa.artist),
			album: song.album
				? {
						...song.album,
					}
				: null,
		}));

		return { data: transformedData, meta: generateMeta(result.count, page, limit) };
	}

	static async getSongBySlug(slug: string) {
		const songData = await DB.Postgres.query.songs.findFirst({
			where: eq(songs.slug, slug),
			with: {
				album: {
					with: {
						artists: {
							with: {
								artist: true,
							},
						},
					},
				},
				artists: {
					with: {
						artist: true,
					},
				},
			},
		});

		if (!songData) return null;

		// Transform data to flatten artist arrays
		return {
			...songData,
			artists: songData.artists.map((sa) => sa.artist),
			album: songData.album
				? {
						...songData.album,
						artists: songData.album.artists.map((aa) => aa.artist),
					}
				: null,
		};
	}

	static async getSongById(id: number) {
		const songData = await DB.Postgres.query.songs.findFirst({
			where: eq(songs.id, id),
			columns: {
				id: true,
				albumId: true,
			},
		});
		return songData;
	}

	static async getTopSongs(query: typeof SongModel.getTopSongs.static) {
		const { type, limit = 10 } = query;

		// Determine which column to order by
		let orderByColumn;
		switch (type) {
			case 'view':
				orderByColumn = songs.viewCount;
				break;
			case 'play':
				orderByColumn = songs.playCount;
				break;
			case 'download':
				orderByColumn = songs.downloadCount;
				break;
		}

		// Get top songs directly from songs table using count columns
		const songsData = await DB.Postgres.query.songs.findMany({
			limit,
			with: {
				album: true,
				artists: {
					with: {
						artist: true,
					},
				},
			},
			orderBy: (song, { desc }) => [desc(orderByColumn)],
		});

		// Transform data and add total based on type
		const result = songsData.map((song) => {
			const total = type === 'view' ? song.viewCount : type === 'play' ? song.playCount : song.downloadCount;
			return {
				...song,
				artists: song.artists.map((sa) => sa.artist),
				album: song.album,
				total,
			};
		});

		return { data: result, total: result.reduce((sum, s) => sum + s.total, 0) };
	}
}
