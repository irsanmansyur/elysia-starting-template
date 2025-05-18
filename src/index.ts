import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import { getEnvVariable } from "../utils/configs/variable";
import { HttpException, ValidationException } from "../utils/errors/exception";
import { ErrorHanlder, parseStackTrace } from "../utils/errors/helper";
import { LogService } from "./log/log.service";
import { db } from "./database";
import { LogController } from "./log/log.controller";
import { initializeRedisClient } from "./database/redis";
import { GatewayController } from "./gateway/gateway.controller";
const allowedOrigins = getEnvVariable("ALLOWED_ORIGINS", "").split(",");
const timeZone = getEnvVariable("TZ", "Asia/Jakarta");

const app = new Elysia()
	.decorate("db", db)
	.get("/", () => "Hello Elysia")
	.use(
		swagger({
			path: "/docs",
			documentation: {
				components: {
					securitySchemes: {
						bearerAuth: {
							type: "http",
							scheme: "bearer",
							bearerFormat: "JWT",
						},
					},
				},
			},
		}),
	)

	/** masalah keamanan browser
	/** allow origin */
	.use(
		cors({
			origin: (origin) => {
				if (getEnvVariable("NODE_ENV", "production") !== "production")
					return true;

				const url = new URL(origin.url);
				return allowedOrigins.includes(url.origin);
			},
			credentials: true,
		}),
	)

	/** untuk tampikan ke log waktu yang di butuhkan
	 ** untuk akses endpoint tertentu  */

	// .onAfterHandle(({ path, request }) => {
	// 	const timestamp = new Date()
	// 		.toLocaleString("id-ID", { timeZone })
	// 		.replace(", ", " ")
	// 		.replaceAll(".", ":");
	// 	console.log(
	// 		`${timestamp} :: ${request.method} :: ${path} :: ${(performance.now() / 100).toFixed(2)}ms`,
	// 	);
	// })

	/** Mengatasi Response error dengan menerapkan
	 ** Excepertion error tersendir **/
	.error({ HttpException, ValidationException })
	.onError(({ error, code, set, path, request }): APP.ErrorResponse => {
		const timestamp = new Date()
			.toLocaleString("id-ID", { timeZone })
			.replace(", ", " ")
			.replaceAll(".", ":");

		const defaultLog = `${timestamp} :: ${request.method} :: ${path} :: ${(performance.now() / 100).toFixed(2)}ms`;

		switch (code) {
			case "ValidationException":
				set.status = error.status;
				LogService.create("warning", error.message, error.errors);
				return { message: error.message, errors: error.errors };
			case "HttpException":
				const status = error.status || 500;
				console.error(
					defaultLog + " :: " + (error?.message || "Internal server error"),
				);
				const stackParse = parseStackTrace(error["stack"]);
				LogService.create(
					status < 500 ? "warning" : "error",
					error.message,
					stackParse,
				);
				set.status = status;
				return { message: error.message };
			case "VALIDATION":
				return ErrorHanlder.validation(error.message, path, request.method);
			case "INVALID_COOKIE_SIGNATURE":
				return ErrorHanlder.validation(error.message, path, request.method);
			case "NOT_FOUND":
				return ErrorHanlder.notFound(error.message);

			default:
				console.error((error as any)?.["message"] || "Internal server error");
				return {
					message: "Internal server error",
				};
		}
	})
	.use(LogController)
	.listen(+getEnvVariable("PORT", "3000"));

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);

initializeRedisClient();
