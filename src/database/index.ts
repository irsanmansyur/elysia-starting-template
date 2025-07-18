import * as schema from './drizle/schema';
import { Config } from '../../utils/configs';
import { drizzle } from 'drizzle-orm/postgres-js';
import Elysia from 'elysia';
import { sql } from 'drizzle-orm';
import Redis from 'ioredis';

const configDb = {
	connection: {
		url: Config.App.env('POSTGRES_URL'),
		ssl: false,
	},
	schema,
};

const redisConfig = {
	host: Config.App.env('REDIS_HOST'),
	port: parseInt(Config.App.env('REDIS_PORT')),
	password: Config.App.env('REDIS_PASSWORD'),
	db: parseInt(Config.App.env('REDIS_DB', '10')),
	connectTimeout: parseInt(Config.App.env('REDIS_CONNECT_TIMEOUT', '5000')),
};
export const DB = {
	Postgres: drizzle(configDb),
	Redis: new Redis(redisConfig),
};

export const DatabasePluging = new Elysia().decorate('DB', DB).onStart(() => {
	keepDBAlive();
	keepDBRedisAlive(1000 * 10);
});

function keepDBAlive(intervalMs: number = 1000 * 30) {
	setInterval(async () => {
		try {
			await DB.Postgres.execute(sql`SELECT 1 LIMIT 1`);
		} catch (err) {
			console.error('❌ DB ping failed', err);
			DB.Postgres = drizzle(configDb);
		}
	}, intervalMs);
}

function keepDBRedisAlive(intervalMs: number = 1000 * 30) {
	DB.Redis.on('connect', () => console.log('[REDIS] :: Redis Client Connected')).on('error', (err) => {
		console.error('[REDIS]', err);
	});
	setInterval(async () => {
		try {
			await DB.Redis.ping();
		} catch (err) {
			console.error('[REDIS] :: ❌ Redis ping failed', err);
			DB.Redis.disconnect();
			DB.Redis = new Redis(redisConfig);
		}
	}, intervalMs);
}
