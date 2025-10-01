import { or, ilike, between, gte, lte } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

export const paginate = ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
	page = +page;
	limit = +limit;
	const offset = (page - 1) * limit;
	return { offset, limit, page };
};

export function generateMeta(count: number, page: number, limit: number) {
	const totalPages = Math.ceil(count / limit); // Menghitung total halaman
	return { total: count, page: page, limit: limit, totalPages: totalPages };
}
