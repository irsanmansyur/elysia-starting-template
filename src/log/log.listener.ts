import { db } from "../database";
import { logsTable } from "../database/drizle/schema";
import { eventEmitter } from "../eventEmmiter";

eventEmitter.on(
	"logger:create",
	async ({ message, level, metadata }: typeof logsTable.$inferInsert) => {
		await db
			.insert(logsTable)
			.values({
				message,
				level,
				metadata,
				timestamp: new Date().toISOString(),
			})
			.catch((e) => {
				console.log(e);
			});
	},
);
