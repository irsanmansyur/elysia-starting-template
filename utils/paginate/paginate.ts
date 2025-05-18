import { or, ilike, between, gte, lte } from "drizzle-orm";
import { SQLiteColumn } from "drizzle-orm/sqlite-core";

export const paginate = ({
	page = 1,
	limit = 10,
}: {
	page?: number;
	limit?: number;
}) => {
	page = +page;
	limit = +limit;
	const offset = (page - 1) * limit;
	return { offset, limit, page };
};

export function generateMeta(count: number, page: number, limit: number) {
	const totalPages = Math.ceil(count / limit); // Menghitung total halaman
	return { total: count, page: page, limit: limit, totalPages: totalPages };
}

/**
 * Helper untuk membangun kondisi pencarian di Drizzle ORM.
 * @param q - Query string untuk pencarian.
 * @param attributes - Daftar kolom yang akan dicari berdasarkan `q`.
 * @returns Kondisi `WHERE` untuk digunakan di Drizzle ORM.
 */
export function searchCondition(q?: string, attributes?: SQLiteColumn[]) {
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
	attribute: SQLiteColumn,
	{
		dateEnd,
		dateStart,
	}: {
		dateStart?: string;
		dateEnd?: string;
	},
) => {
	if (dateEnd && dateEnd.length === 10) {
		dateEnd = dateEnd + " 23:59:59";
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
