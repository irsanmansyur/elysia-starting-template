import { count, eq } from "drizzle-orm";
import { HttpException } from "~/utils/plugins/errors/exception";
import { fileHelpers } from "~/utils/helpers/file";
import { generateMeta, paginate } from "~/utils/helpers/paginate";
import { searchCondition } from "~/utils/helpers/postgres";
import { DB } from "~/utils/plugins/database";
import { templates } from "~/utils/plugins/database/schema";
import type { ModelTemplate } from "./model";

export const templateService = {
  async createTemplate({ sound, thumbnailFile, ...body }: typeof ModelTemplate.create.static) {
    const [newTemplate] = await DB.Postgres.insert(templates)
      .values({
        thumbnail: "",
        ...body,
      })
      .returning();
    const thumbnail = await fileHelpers.saveFile(thumbnailFile, `templates/thumbnails/${newTemplate.id}`);
    const soundPath = await fileHelpers.saveFile(sound, `templates/sounds/${newTemplate.id}`);
    await DB.Postgres.update(templates).set({ thumbnail }).where(eq(templates.id, newTemplate.id));
    return { ...newTemplate, thumbnail, soundName: soundPath };
  },

  async getTemplates(query: typeof ModelTemplate.list.static) {
    const { offset, limit, page } = paginate(query);
    const whereClause = searchCondition(query?.search, [templates.name, templates.soundName]);
    const [data, total] = await Promise.all([
      DB.Postgres.query.templates.findMany({
        where: whereClause,
        limit,
        offset,
      }),
      DB.Postgres.select({ count: count() }).from(templates).where(whereClause),
    ]);
    return { data, meta: generateMeta(total[0].count, page, limit) };
  },

  async getTemplateById(id: string) {
    const template = await DB.Postgres.query.templates.findFirst({
      where: eq(templates.id, id),
    });
    if (!template) {
      throw new HttpException("Template not found", 404);
    }
    return template;
  },

  async updateTemplate(id: string, { thumbnailFile, ...body }: typeof ModelTemplate.update.static) {
    const existingTemplate = await this.getTemplateById(id);

    let thumbnail = existingTemplate.thumbnail;
    if (thumbnailFile) {
      // Hapus thumbnail lama
      if (existingTemplate.thumbnail) {
        fileHelpers.deleteFile(existingTemplate.thumbnail);
      }
      // Simpan thumbnail baru
      thumbnail = await fileHelpers.saveFile(thumbnailFile, `templates/thumbnails/${id}`);
    }

    const [updatedTemplate] = await DB.Postgres.update(templates)
      .set({
        ...body,
        thumbnail,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, id))
      .returning();

    return updatedTemplate;
  },

  async deleteTemplate(id: string) {
    const existingTemplate = await this.getTemplateById(id);

    // Hapus thumbnail saja, audio tidak dihapus
    if (existingTemplate.thumbnail) {
      fileHelpers.deleteFile(existingTemplate.thumbnail);
    }

    await DB.Postgres.delete(templates).where(eq(templates.id, id));

    return existingTemplate;
  },
};
