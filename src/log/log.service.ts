import { and, count, desc } from "drizzle-orm";
import { db } from "../database";

import { GetLog } from "./log.validator";
import {
	generateMeta,
	paginate,
	searchCondition,
	whereDateFilter,
} from "../../utils/paginate/paginate";
import { logsTable } from "../database/drizle/schema";
import { eventEmitter } from "../eventEmmiter";

export class LogService {
	static instance: LogService;

	constructor() {
		console.log("LogService initialized");
	}

	static getInstance(): LogService {
		if (!LogService.instance) {
			LogService.instance = new LogService();
		}
		return LogService.instance;
	}

	static create(level: APP.LogLevel, message: string, metadata?: any) {
		eventEmitter.emit("logger:create", { message, level, metadata });
	}
	static async getAll({ ...pgn }: typeof GetLog.static) {
		const { page, limit, offset } = paginate(pgn);
		const searchQuery = searchCondition(pgn.search, [logsTable.message]);

		const dateFilter = whereDateFilter(logsTable.timestamp, {
			dateStart: pgn.dateStart,
			dateEnd: pgn.dateEnd,
		});

		const where = and(searchQuery, dateFilter);

		const total = await db
			.select({ count: count() })
			.from(logsTable)
			.where(where)
			.then((res) => res[0]?.count || 0);

		// Query utama dengan innerJoin()
		const logs = await db
			.select()
			.from(logsTable)
			.where(where)
			.orderBy(desc(logsTable.timestamp))
			.limit(limit)
			.offset(offset);

		return { data: logs, meta: generateMeta(total, page, limit) };
	}
}
