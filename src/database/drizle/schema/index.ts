import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

export const logsTable = t.sqliteTable("logs", {
	id: t.integer("id").primaryKey({ autoIncrement: true }),
	timestamp: t.text("timestamp").default(sql`CURRENT_TIMESTAMP`),
	level: t.text("level", { length: 10 }).notNull().$type<APP.LogLevel>(),
	message: t.text("message", { length: 255 }).notNull(),
	metadata: t
		.text("metadata", { mode: "json" })
		.$type<Record<string, any>>()
		.default(sql`'{}'`),
});
