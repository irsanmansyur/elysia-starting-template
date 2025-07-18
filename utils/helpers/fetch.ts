import { HttpException } from '../plugins/errors/exception';

export const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 5000) => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		});
		clearTimeout(timeout);

		const responseData = await response.json().catch(() => null);
		if (!response.ok) {
			return {
				status: 'error',
				statusCode: response.status,
				data: responseData,
			};
		}

		// Periksa apakah respons berhasil (status 2xx)
		return {
			status: 'success',
			statusCode: response.status,
			data: responseData,
		};
	} catch (err: any) {
		clearTimeout(timeout);

		if (err.name === 'AbortError') {
			throw new HttpException('Request timeout: The request took too long to complete.');
		} else if (err.name === 'TypeError' && err.message.includes('fetch')) {
			throw new HttpException('Network error: Unable to connect to the server. Please check your connection.');
		} else {
			throw new HttpException(`Unexpected error: ${err.message}`);
		}
	}
};
