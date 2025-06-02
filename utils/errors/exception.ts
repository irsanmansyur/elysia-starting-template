export class HttpException extends Error {
	stack?: string | undefined;
	saveLog = true;
	constructor(
		public message: string,
		public status?: number,
		public metadata?: object,
		saveLog?: boolean,
	) {
		super(message);
		if (saveLog !== undefined) this.saveLog = saveLog;
		// Menghapus baris stack trace yang terkait dengan HttpException
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HttpException);
		} else {
			// Jika Error.captureStackTrace tidak tersedia, potong stack trace secara manual
			const stack = this.stack?.split("\n") || [];
			// Hapus baris yang terkait dengan HttpException
			this.stack = stack
				.filter((line) => !line.includes("HttpException"))
				.join("\n");
		}
	}
}

export class ValidationException extends Error {
	public status = 412;
	constructor(public errors: APP.Errors) {
		super("Validation Errors");
	}
}
