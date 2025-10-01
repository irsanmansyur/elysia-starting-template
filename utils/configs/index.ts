import { getEnv } from '../helpers/app';

export const isProduction = getEnv('NODE_ENV', 'development') === 'production';
export const allowedOrigins = getEnv('ALLOWED_ORIGINS', 'hsda').split(',');
export const port = parseInt(getEnv('PORT', '3000'), 10);
export const timeZone = getEnv('TIMEZONE', 'Asia/Jakarta');
export const appName = getEnv('APP_NAME', 'Elysia App');
export const appVersion = getEnv('APP_VERSION', '1.0.0');
export const appDescription = getEnv('APP_DESCRIPTION', 'Elysia App Description');
export const appAuthor = getEnv('APP_AUTHOR', 'Elysia App Author');

const AppConfig = { isProduction, allowedOrigins, port, timeZone, appName, appVersion } as const;
export default AppConfig;
