import 'elysia';

declare module 'elysia' {
	interface Context {
		isProduction: boolean;
	}
}
