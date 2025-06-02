import { getEnvVariable } from "../configs/variable";
import { eventEmitter } from "../event/plugin";

export const parseStackTrace = (stack: string = "") => {
	const stackLines = stack.trim().split("\n");
	const relevantLines = stackLines.slice(1);
	const parsedLines = relevantLines
		.filter((line) => !line.includes("unknown:"))
		.map((line) => {
			const match = line.match(/at (.+) \((.+):(\d+):(\d+)\)/);
			if (match) {
				const [, functionName, filePath, lineNumber, columnNumber] = match;
				return { functionName, filePath, lineNumber, columnNumber };
			}
			return null;
		})
		.filter(Boolean);
	return parsedLines;
};

export abstract class ErrorHanlder {
	abstract message: string;
	abstract stack: string;
	static notFound(message: string = "Not Found") {
		return { message };
	}
	static validation(
		errorValidationString: string,
		path: string,
		method: string,
	) {
		try {
			const parsedError = JSON.parse(
				errorValidationString,
			) as APP.ValidationResponse;
			const formattedErrors = parsedError.errors.reduce(
				(acc: Record<string, string[]>, err) => {
					const path = err.path.replace("/", "") || "root"; // Remove leading slash
					if (!acc[path]) {
						acc[path] = [];
					}
					acc[path].push(err.summary || err.message || "Validation error");
					return acc;
				},
				{},
			);

			const timeZone = getEnvVariable("TIMEZONE", "Asia/Jakarta");

			const timestamp = new Date()
				.toLocaleString("id-ID", { timeZone })
				.replace(", ", " ")
				.replaceAll(".", ":");

			console.error(
				`${timestamp} :: ${method} :: ${path} :: ${JSON.stringify(formattedErrors)}`,
			);

			const msgs = parsedError.message || "Validation failed";
			eventEmitter.emit("create.log", {
				level: "warn",
				message: msgs,
				meta: formattedErrors,
			});

			return {
				message: msgs,
				errors: formattedErrors,
			};
		} catch (e) {
			return {
				message: "Failed to parse error message",
				errors: {},
			};
		}
	}
}
