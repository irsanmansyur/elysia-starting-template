import { t } from "elysia";

export const PaginateDto = t.Object({
	page: t.Number({ default: 1, minimum: 1 }),
	limit: t.Number({ default: 10, minimum: 1 }),
	search: t.Optional(t.String({ maxLength: 100 })),
});

export const DateRangeDto = t.Object({
	dateStart: t.Optional(t.String({ format: "dateOrDateTime" })),
	dateEnd: t.Optional(t.String({ format: "dateOrDateTime" })),
});
