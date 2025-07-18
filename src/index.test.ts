import { treaty } from '@elysiajs/eden';
import { describe, expect, it } from 'bun:test';
import { routes } from './routes';

export const apiTest = treaty(routes);
describe('API Test Setup', () => {
	it('should have the app initialized', async () => {
		const { status } = await apiTest.get();
		expect(status).toBe(200);
	});
});
