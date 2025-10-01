type Hits = {
	limit: number;
	exp: number;
	delayMs: number;
};
export const ThrolettleStore = new Map<
	string,
	{
		hits: Hits & {
			ignorePaths: (Hits & { path: string })[];
		};
	}
>();

export function cleanupExpiredHits() {
	const now = Date.now();

	for (const [key, value] of ThrolettleStore) {
		// Hapus hit utama jika expired
		if (value.hits.exp + value.hits.delayMs < now) {
			ThrolettleStore.delete(key);
			continue;
		}

		// Filter ignorePaths yang expired
		value.hits.ignorePaths = value.hits.ignorePaths.filter((hit) => hit.exp + hit.delayMs >= now);
	}
}
