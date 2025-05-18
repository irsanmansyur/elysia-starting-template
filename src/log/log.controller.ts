import Elysia from "elysia";
import { LogService } from "./log.service";
import { GetLog } from "./log.validator";
import "./log.listener";

export const LogController = new Elysia({}).group("/log", (group) =>
	group.get(
		"",
		async ({ query }) => {
			const { data, meta } = await LogService.getAll(query);
			return {
				message: "Tag Ids",
				data,
				meta,
			};
		},
		{ query: GetLog },
	),
);
