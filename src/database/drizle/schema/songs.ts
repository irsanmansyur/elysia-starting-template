import { pgTable, varchar, integer, timestamp, serial, smallint } from 'drizzle-orm/pg-core';
import { albums } from './albums';

export const songs = pgTable('songs', {
	id: serial('id').primaryKey(),
	albumId: integer('album_id')
		.notNull()
		.references(() => albums.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 255 }).notNull(),
	duration: integer('duration'),
	slug: varchar('slug', { length: 255 }).unique().notNull(),
	status: smallint('status').default(1).notNull(),
	viewCount: integer('view_count').default(0).notNull(),
	playCount: integer('play_count').default(0).notNull(),
	downloadCount: integer('download_count').default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
});
