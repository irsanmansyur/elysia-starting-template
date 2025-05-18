import { t } from "elysia";
import {
	DateRangeDto,
	PaginateDto,
} from "../../utils/validators/validators/general";

export const GetLog = t.Object({
	...PaginateDto.properties,
	...DateRangeDto.properties,
});
