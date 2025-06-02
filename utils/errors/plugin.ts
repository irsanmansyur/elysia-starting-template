import { Elysia } from "elysia";
import { getEnvVariable } from "../configs/variable";
import { HttpException, ValidationException } from "./exception";
import { ErrorHanlder, parseStackTrace } from "./helper";
import { eventEmitter } from "../event/plugin";

const timeZone = "Asia/Jakarta";

export const errorPlugin = new Elysia()
	.decorate(
		"isProduction",
		getEnvVariable("NODE_ENV", "production") !== "production",
	)
	.error({ HttpException, ValidationException })
	.onError(({ error, code, set, path, request, isProduction }) => {
		const timestamp = new Date()
			.toLocaleString("id-ID", { timeZone })
			.replace(", ", " ")
			.replaceAll(".", ":");

		const defaultLog = `${timestamp} :: ${request.method} :: ${path} :: ${(performance.now() / 100).toFixed(2)}ms`;

		switch (code) {
			case "ValidationException":
				set.status = error.status;
				eventEmitter.emit("create.log", {
					level: "warn",
					message: error.message,
					meta: error.errors,
				});
				return { message: error.message, errors: error.errors };

			case "HttpException":
				const status = error.status || 500;
				console.error(
					defaultLog + " :: " + (error?.message || "Internal server error"),
				);

				const stackParse = parseStackTrace(error["stack"]);

				if (error.saveLog) {
					eventEmitter.emit("create.log", {
						level: status < 500 ? "warn" : "error",
						message: error.message,
						meta: stackParse,
					});
				}

				set.status = status;
				return { message: error.message };

			case "VALIDATION":
			case "INVALID_COOKIE_SIGNATURE":
				return ErrorHanlder.validation(error.message, path, request.method);

			case "NOT_FOUND":
				return ErrorHanlder.notFound(error.message);

			default:
				const messageError =
					(error as any)?.["message"] || "Internal server error";
				console.error(messageError);
				eventEmitter.emit("create.log", {
					level: "error",
					message: messageError,
				});
				return {
					message: isProduction ? "Internal server error" : messageError,
				};
		}
	});
