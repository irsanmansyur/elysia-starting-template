import Elysia from "elysia";
import { ModelTemplate } from "./model";
import { templateService } from "./service";

export const templateRoutes = new Elysia({
  name: "template-routes",
  prefix: "/templates",
  detail: {
    tags: ["Template Management"],
    summary: "Template Management",
    description: "Template Management",
  },
})
  .post(
    "/",
    async ({ body }) => {
      const data = await templateService.createTemplate(body);
      return { message: "created template successfully", data };
    },
    {
      body: ModelTemplate.create,
    },
  )
  .get(
    "/",
    async ({ query }) => {
      const { data, meta } = await templateService.getTemplates(query);
      return { data, meta };
    },
    {
      query: ModelTemplate.list,
    },
  )
  .get(
    "/:id",
    async ({ params }) => {
      const data = await templateService.getTemplateById(params.id);
      return { data };
    },
    {
      params: ModelTemplate.params,
    },
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      const data = await templateService.updateTemplate(params.id, body);
      return { message: "updated template successfully", data };
    },
    {
      params: ModelTemplate.params,
      body: ModelTemplate.update,
    },
  )
  .delete(
    "/:id",
    async ({ params }) => {
      const data = await templateService.deleteTemplate(params.id);
      return { message: "deleted template successfully", data };
    },
    {
      params: ModelTemplate.params,
    },
  );
