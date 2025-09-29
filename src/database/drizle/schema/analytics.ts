import { pgTable, integer, timestamp, serial, varchar } from 'drizzle-orm/pg-core';
import { albums } from './albums';
import { songs } from './songs';

// ALBUM VIEWS
export const albumViews = pgTable('album_views', {
	id: serial('id').primaryKey(),
	albumId: integer('album_id')
		.notNull()
		.references(() => albums.id, { onDelete: 'cascade' }),
	ipAddress: varchar('ip_address', { length: 45 }),
	userAgent: varchar('user_agent', { length: 255 }),
	viewedAt: timestamp('viewed_at').defaultNow(),
});

// SONG VIEWS
export const songViews = pgTable('song_views', {
	id: serial('id').primaryKey(),
	songId: integer('song_id')
		.notNull()
		.references(() => songs.id, { onDelete: 'cascade' }),
	ipAddress: varchar('ip_address', { length: 45 }),
	userAgent: varchar('user_agent', { length: 255 }),
	viewedAt: timestamp('viewed_at').defaultNow(),
});

// SONG PLAYS
export const songPlays = pgTable('song_plays', {
	id: serial('id').primaryKey(),
	songId: integer('song_id')
		.notNull()
		.references(() => songs.id, { onDelete: 'cascade' }),
	ipAddress: varchar('ip_address', { length: 45 }),
	userAgent: varchar('user_agent', { length: 255 }),
	playedAt: timestamp('played_at').defaultNow(),
});

// SONG DOWNLOADS
export const songDownloads = pgTable('song_downloads', {
	id: serial('id').primaryKey(),
	songId: integer('song_id')
		.notNull()
		.references(() => songs.id, { onDelete: 'cascade' }),
	ipAddress: varchar('ip_address', { length: 45 }),
	userAgent: varchar('user_agent', { length: 255 }),
	downloadedAt: timestamp('downloaded_at').defaultNow(),
});
