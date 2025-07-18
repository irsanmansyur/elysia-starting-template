import * as t from 'drizzle-orm/pg-core';

export const logsTable = t.pgTable('logs', {
	id: t.serial('id').primaryKey(),
	timestamp: t.timestamp('timestamp', { withTimezone: false }).defaultNow(),
	level: t.varchar('level', { length: 10 }).notNull().$type<APP.LogLevel>(),
	message: t.varchar('message', { length: 255 }).notNull(),
	metadata: t.jsonb('metadata').$type<Record<string, any>>().default({}),
});
