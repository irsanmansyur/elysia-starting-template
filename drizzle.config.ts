import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/database/drizle/schema/index.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: "file:./" + process.env.DB_LITE,
	},
});
