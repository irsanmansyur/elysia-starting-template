import { between, gte, ilike, lte, or } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

/**
 * Helper untuk membangun kondisi pencarian di Drizzle ORM.
 * @param q - Query string untuk pencarian.
 * @param attributes - Daftar kolom yang akan dicari berdasarkan `q`.
 * @returns Kondisi `WHERE` untuk digunakan di Drizzle ORM.
 */
export function searchCondition(q?: string, attributes?: PgColumn[]) {
	if (!q || !attributes || attributes.length === 0) {
		return undefined; // Jika tidak ada pencarian, return undefined
	}

	return or(...attributes.map((attribute) => ilike(attribute, `%${q}%`)));
}

/**
 * Helper untuk dateStart dan dateEnd optional
 * @param dateStart - Query string untuk pencarian.
 * @param dateEnd - Query string untuk pencarian.
 * @param attributes - Daftar kolom yang akan dicari berdasarkan `q`.
 */
export const whereDateFilter = (
	attribute: PgColumn,
	{
		dateEnd,
		dateStart,
	}: {
		dateStart?: string;
		dateEnd?: string;
	},
) => {
	if (dateEnd && dateEnd.length === 10) {
		dateEnd = dateEnd + ' 23:59:59';
	}

	if (dateStart && dateEnd) {
		const start = new Date(dateStart);
		const end = new Date(dateEnd);
		return between(attribute, start, end);
	}
	if (dateStart) {
		const start = new Date(dateStart);
		return gte(attribute, start);
	}
	if (dateEnd) {
		const end = new Date(dateEnd);
		return lte(attribute, end);
	}
	return undefined;
};
