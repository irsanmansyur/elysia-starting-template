import Redis from "ioredis";
import { getEnvVariable } from "../../utils/configs/variable";

export let redisClient: Redis;

export async function initializeRedisClient() {
	redisClient = new Redis({
		host: getEnvVariable("REDIS_HOST"),
		port: parseInt(getEnvVariable("REDIS_PORT")),
		password: getEnvVariable("REDIS_PASSWORD"),
		db: parseInt(getEnvVariable("REDIS_DB", "8")),
	});
	redisClient
		.on("error", (err) => {
			console.error("[REDIS ERROR]", err);
		})
		.on("connect", () => console.log("Redis Client Connected"));
}
