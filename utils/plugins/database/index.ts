import * as schema from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import Elysia from 'elysia';
import { sql } from 'drizzle-orm';
import Redis from 'ioredis';
import { getEnv } from '~/utils/helpers/app';

const configDb = {
	connection: {
		url: getEnv('POSTGRES_URL'),
		ssl: false,
	},
	schema,
};

const redisConfig = {
	host: getEnv('REDIS_HOST'),
	port: parseInt(getEnv('REDIS_PORT')),
	password: getEnv('REDIS_PASSWORD'),
	db: parseInt(getEnv('REDIS_DB', '10')),
	connectTimeout: parseInt(getEnv('REDIS_CONNECT_TIMEOUT', '5000')),
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
			console.error('❌ DB ping failed', (err as any)?.message || err);
			DB.Postgres = drizzle(configDb);
		}
	}, intervalMs);
}

function keepDBRedisAlive(intervalMs: number = 1000 * 10) {
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
