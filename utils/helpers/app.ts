export function getEnv(key: string, defaultValue?: string): string {
	const vl = Bun.env[key] || defaultValue || undefined;
	if (vl === undefined) {
		throw new Error(`Environment variable ${key} is not set.`);
	}
	return vl;
}
