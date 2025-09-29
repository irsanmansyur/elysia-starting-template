// db/schema/music.ts
import { relations } from 'drizzle-orm';
import { pgTable, text, varchar, integer, timestamp, primaryKey, serial, smallint } from 'drizzle-orm/pg-core';
import { albums } from './albums';
import { songs } from './songs';
import { albumViews, songViews, songPlays, songDownloads } from './analytics';

export { songs, albums, albumViews, songViews, songPlays, songDownloads };

// ARTISTS
export const artists = pgTable('artists', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).unique().notNull(),
	bio: text('bio'),
	createdAt: timestamp('created_at').defaultNow(),
});

// PLAYLISTS
export const playlists = pgTable('playlists', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	coverUrl: text('cover_url'),
	createdAt: timestamp('created_at').defaultNow(),
});

// SONG_ARTISTS (many-to-many)
export const songArtists = pgTable(
	'song_artists',
	{
		songId: integer('song_id')
			.notNull()
			.references(() => songs.id, { onDelete: 'cascade' }),
		artistId: integer('artist_id')
			.notNull()
			.references(() => artists.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow(),
	},
	(table) => [
		primaryKey({
			columns: [table.songId, table.artistId],
		}),
	],
);

// ALBUM_ARTISTS (many-to-many)
export const albumArtists = pgTable(
	'album_artists',
	{
		albumId: integer('album_id')
			.notNull()
			.references(() => albums.id, { onDelete: 'cascade' }),
		artistId: integer('artist_id')
			.notNull()
			.references(() => artists.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow(),
	},
	(table) => [
		primaryKey({
			columns: [table.albumId, table.artistId],
		}),
	],
);

// PLAYLIST_SONGS (many-to-many)
export const playlistSongs = pgTable(
	'playlist_songs',
	{
		playlistId: integer('playlist_id')
			.notNull()
			.references(() => playlists.id, { onDelete: 'cascade' }),
		songId: integer('song_id')
			.notNull()
			.references(() => songs.id, { onDelete: 'cascade' }),
		addedAt: timestamp('added_at').defaultNow(),
	},
	(table) => [
		primaryKey({
			columns: [table.playlistId, table.songId],
		}),
	],
);

export const songsRelations = relations(songs, ({ one, many }) => ({
	album: one(albums, { fields: [songs.albumId], references: [albums.id] }),
	artists: many(songArtists),
	views: many(songViews),
	plays: many(songPlays),
	downloads: many(songDownloads),
}));

export const artistsRelations = relations(artists, ({ many }) => ({
	songs: many(songArtists),
	albums: many(albumArtists),
}));

export const albumsRelations = relations(albums, ({ many }) => ({
	songs: many(songs),
	artists: many(albumArtists),
	views: many(albumViews),
}));

export const songArtistsRelations = relations(songArtists, ({ one }) => ({
	song: one(songs, { fields: [songArtists.songId], references: [songs.id] }),
	artist: one(artists, { fields: [songArtists.artistId], references: [artists.id] }),
}));

export const albumArtistsRelations = relations(albumArtists, ({ one }) => ({
	album: one(albums, { fields: [albumArtists.albumId], references: [albums.id] }),
	artist: one(artists, { fields: [albumArtists.artistId], references: [artists.id] }),
}));

export const albumViewsRelations = relations(albumViews, ({ one }) => ({
	album: one(albums, { fields: [albumViews.albumId], references: [albums.id] }),
}));

export const songViewsRelations = relations(songViews, ({ one }) => ({
	song: one(songs, { fields: [songViews.songId], references: [songs.id] }),
}));

export const songPlaysRelations = relations(songPlays, ({ one }) => ({
	song: one(songs, { fields: [songPlays.songId], references: [songs.id] }),
}));

export const songDownloadsRelations = relations(songDownloads, ({ one }) => ({
	song: one(songs, { fields: [songDownloads.songId], references: [songs.id] }),
}));
