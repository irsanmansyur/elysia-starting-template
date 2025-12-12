import { auth } from "~/utils/auth";
import app from "~/utils/plugins/app";
import { connectMongo } from "~/utils/plugins/database/mongoose";
import { assetsRoutes } from "./assets";
import { templateRoutes } from "./templates";
import { weddingRoutes } from "./weddings";

await connectMongo();
export const routes = app
  .get("/", () => "Hello Kamu")
  .get("/health", () => "OK", {
    throttle: {
      hits: {
        limit: 2,
        ttl: "3s",
        delay: "3s",
      },
    },
  })
  .mount(auth.handler)
  .group("/api/v1", (apG) => apG.use(templateRoutes).use(assetsRoutes).use(weddingRoutes));
