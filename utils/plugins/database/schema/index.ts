import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulid";

export * from "./auth";

export const templates = pgTable("templates", {
  id: varchar("id", { length: 27 })
    .primaryKey()
    .$default(() => ulid()),
  name: text("name").notNull(),
  soundName: text("sound_name").notNull(),
  status: varchar("status", { length: 10 }).notNull().default("draft"),
  thumbnail: text("thumbnail").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
