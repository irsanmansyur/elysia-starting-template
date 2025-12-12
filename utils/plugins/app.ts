import Elysia from "elysia";
import { corsPluging } from "~/utils/plugins/cors";
import { errorPlugin } from "~/utils/plugins/errors/plugin";
import { DatabasePluging } from "./database";
import { EventEmitterPlugin } from "./event";
import { logPlugin } from "./log";
import { throttlePluging } from "./throttle";

const app = new Elysia()
  .use(EventEmitterPlugin)
  .use(logPlugin)
  .use(errorPlugin)
  .use(
    throttlePluging({
      hits: { limit: 300, ttl: "60s", delay: "10s" },
    }),
  )
  .use(DatabasePluging)
  .use(corsPluging);
export default app;
