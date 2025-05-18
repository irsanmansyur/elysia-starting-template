export function getEnvVariable(key: string, defaultValue?: string) {
	const value = Bun.env?.[key];

	if (value !== undefined) {
		return value;
	}

	if (defaultValue !== undefined) {
		return defaultValue;
	}

	throw new Error(`Environment variable ${key} is not defined`);
}
