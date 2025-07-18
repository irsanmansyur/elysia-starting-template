export class HttpException extends Error {
	stack?: string;
	saveLog = true;
	data: Record<string, any>;

	constructor(
		message: string | Record<string, any> | null,
		public status?: number,
		public metadata?: object,
		saveLog?: boolean,
	) {
		// Tentukan pesan utama
		const msg = typeof message === 'string' ? message : typeof message === 'object' && message?.message ? message.message : 'Internal Server Error';

		super(msg); // Panggil Error constructor

		// Standarisasi ke object payload
		this.data =
			typeof message === 'string' || message === null
				? { message: msg }
				: {
						...message,
						message: message.message ?? msg,
					};

		if (saveLog !== undefined) this.saveLog = saveLog;

		// Potong stack trace
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HttpException);
		} else {
			const lines = this.stack?.split('\n') || [];
			this.stack = lines.filter((line) => !line.includes('HttpException')).join('\n');
		}
	}
}

export class ValidationException extends Error {
	public status = 412;
	constructor(public errors: APP.Errors) {
		super('Validation Errors');
	}
}
