import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/database/drizle/schema/index.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.POSTGRES_URL!,
		ssl: false,
	},
});
