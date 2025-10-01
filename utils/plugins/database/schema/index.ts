import { pgTable, serial } from 'drizzle-orm/pg-core';

export const tests = pgTable('tests', {
	id: serial('id').primaryKey(),
});
