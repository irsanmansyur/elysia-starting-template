import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';

// ALBUMS
export const albums = pgTable('albums', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	releaseDate: timestamp('release_date'),
	createdAt: timestamp('created_at').defaultNow(),
});
