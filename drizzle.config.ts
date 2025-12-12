import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./utils/plugins/database/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL || "",
    ssl: false,
  },
});
