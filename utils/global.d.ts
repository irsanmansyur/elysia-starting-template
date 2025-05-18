declare namespace APP {
	type Errors = Record<string, string[]>;
	type ErrorResponse = {
		message: string;
		errors?: Errors;
	};

	type ValidationResponse = {
		type: string; // Misalnya "validation"
		on: string; // Bagian yang divalidasi, contoh: "body"
		summary: string; // Ringkasan error, misalnya "Property 'password' is missing"
		property: string; // Properti yang divalidasi, misalnya "/password"
		message: string; // Pesan error umum
		expected: Record<string, any>; // Objek dengan nilai yang diharapkan
		found: Record<string, any>; // Objek yang ditemukan
		errors: ValidationError[]; // Daftar error yang terdeteksi
	};

	type LogLevel = "info" | "warning" | "error";
}
