import * as schema from './drizle/schema';
import { getEnvVariable } from '../../utils/configs/variable';
import { drizzle } from 'drizzle-orm/postgres-js';
import Elysia from 'elysia';
import { sql } from 'drizzle-orm';
import Redis from 'ioredis';

const configDb = {
	connection: {
		url: getEnvVariable('POSTGRES_URL'),
		ssl: false,
	},
	schema,
};

const redisConfig = {
	host: getEnvVariable('REDIS_HOST'),
	port: parseInt(getEnvVariable('REDIS_PORT')),
	password: getEnvVariable('REDIS_PASSWORD'),
	db: parseInt(getEnvVariable('REDIS_DB', '10')),
	connectTimeout: parseInt(getEnvVariable('REDIS_CONNECT_TIMEOUT', '5000')),
};
export const DB = {
	Postgres: drizzle(configDb),
	Redis: new Redis(redisConfig),
};

export const DatabasePluging = new Elysia().decorate('DB', DB).onStart(() => {
	DB.Redis.on('connect', () => console.log('Redis Client Connected')).on('error', (err) => {
		console.error('[REDIS ERROR]', err);
	});
	keepDBAlive();
});

function keepDBAlive(intervalMs: number = 1000 * 30) {
	setInterval(async () => {
		try {
			await DB.Postgres.execute(sql`SELECT 1 LIMIT 1`);
			console.log('✅ DB ping ok');
		} catch (err) {
			console.error('❌ DB ping failed', err);
			DB.Postgres = drizzle(configDb);
		}

		try {
			await DB.Redis.ping();
			console.log('✅ Redis ping ok');
		} catch (err) {
			console.error('❌ Redis ping failed', err);
			DB.Redis.disconnect();
			DB.Redis = new Redis(redisConfig);
		}
	}, intervalMs);
}
