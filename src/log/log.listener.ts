import { eventEmitter } from "../../utils/event/plugin";
import { DB } from "../database";
import { logsTable } from "../database/drizle/schema";

eventEmitter.on(
	"logger:create",
	async ({ message, level, metadata }: typeof logsTable.$inferInsert) => {
		await DB.Postgres.insert(logsTable)
			.values({
				level,
				message,
				metadata,
			})
			.catch((e) => {
				console.log(e);
			});
	},
);
