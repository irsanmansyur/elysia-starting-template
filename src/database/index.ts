import "dotenv/config";
import Redis from "ioredis";
import * as schema from "./drizle/schema";
import { getEnvVariable } from "../../utils/configs/variable";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
	url: "file:./" + getEnvVariable("DB_LITE"),
});

export const db = drizzle(client, { schema });

export const redisClient = new Redis({
	host: getEnvVariable("REDIS_HOST"),
	port: parseInt(getEnvVariable("REDIS_PORT")),
	password: getEnvVariable("REDIS_PASSWORD"),
	db: parseInt(getEnvVariable("REDIS_DB", "8")),
});
redisClient.on("error", (err) => {
	console.error("[REDIS ERROR]", err);
});
