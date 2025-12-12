import { t } from "elysia";
import { PaginateDto } from "~/utils/plugins/validators/general";

export const ModelTemplate = {
  create: t.Object({
    name: t.String(),
    sound: t.File(),
    soundName: t.String(),
    thumbnailFile: t.File(),
    status: t.Union([t.Literal("active"), t.Literal("draft"), t.Literal("disable")]),
  }),
  update: t.Object({
    name: t.Optional(t.String()),
    soundName: t.Optional(t.String()),
    thumbnailFile: t.Optional(t.File()),
    status: t.Optional(t.Union([t.Literal("active"), t.Literal("draft"), t.Literal("disable")])),
  }),
  list: t.Object({
    ...PaginateDto.properties,
  }),
  params: t.Object({
    id: t.String(),
  }),
};
