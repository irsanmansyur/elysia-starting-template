import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { allowedOrigins } from "./configs";
import { getEnv } from "./helpers/app";
import { DB } from "./plugins/database";
import { user } from "./plugins/database/schema";

export const auth = betterAuth({
  database: drizzleAdapter(DB.Postgres, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: getEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
    },
    github: {
      clientId: getEnv("GITHUB_CLIENT_ID"),
      clientSecret: getEnv("GITHUB_CLIENT_SECRET"),
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async ({ id }: { id: string }) => {
          await DB.Postgres.update(user).set({ role: "admin" }).where(eq(user.id, id));
        },
      },
    },
  },
  trustedOrigins: allowedOrigins,
});
