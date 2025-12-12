import type Elysia from "elysia";
import { ttlToDate, ttlToMs } from "~/utils/helpers/date";
import { getClientIP } from "~/utils/helpers/ip";
import { HttpException } from "../errors/exception";
import { cleanupExpiredHits, ThrolettleStore } from "./store";

type ThrottleOptions = {
  hits: {
    limit: number;
    ttl: APP.TTL;
    delay?: APP.TTL;
  };
};
let cleanupInterval: NodeJS.Timeout | null = null;

export const throttlePluging =
  ({ hits }: ThrottleOptions) =>
  (app: Elysia) =>
    app
      .macro({
        throttle: (privThrottle: ThrottleOptions) => ({
          transform({ request, server, path, set }) {
            const ip = getClientIP(request, server);
            const clientThrottle = ThrolettleStore.get(ip);
            const delayMs = ttlToMs(privThrottle.hits.delay || "60s");
            const expMs = ttlToDate(privThrottle.hits.ttl).getTime();
            if (!clientThrottle) {
              ThrolettleStore.set(ip, {
                hits: {
                  limit: 1,
                  exp: expMs,
                  delayMs,
                  ignorePaths: [
                    {
                      path,
                      limit: 1,
                      exp: expMs,
                      delayMs,
                    },
                  ],
                },
              });
              return;
            }

            const privaHits = clientThrottle.hits.ignorePaths.find((p) => p.path === path);

            if (!privaHits) {
              ThrolettleStore.set(ip, {
                hits: {
                  limit: 1,
                  exp: expMs,
                  delayMs,
                  ignorePaths: [
                    {
                      path,
                      limit: 1,
                      exp: expMs,
                      delayMs,
                    },
                  ],
                },
              });
              return;
            }

            if (privaHits.exp < Date.now()) {
              const expMs = ttlToDate(privThrottle.hits.ttl).getTime();
              privaHits.limit = 1;
              privaHits.exp = expMs;
              ThrolettleStore.set(ip, clientThrottle);
              return;
            }

            if (privaHits.limit >= privThrottle.hits.limit) {
              throw new HttpException("Too Many Requests", 429);
            }
            set.headers["X-RateLimit-Remaining"] = (privThrottle.hits.limit - privaHits.limit).toString();
            if (privThrottle.hits.delay) {
              const delayMs = ttlToMs(privThrottle.hits.delay);
              const waitTime = privaHits.limit * delayMs;
              const resetTime = privaHits.exp - Date.now();
              if (waitTime > resetTime) {
                throw new HttpException(`Too Many Requests, retry after ${Math.ceil(resetTime / 1000)} seconds`, 429);
              }
            }
            privaHits.limit += 1;
          },
          beforeHandle() {},
        }),
      })
      .onStart(() => {
        // Jalankan cleanup setiap 1 menit
        cleanupInterval = setInterval(cleanupExpiredHits, 60_000);
      })
      .onStop(() => {
        if (cleanupInterval) clearInterval(cleanupInterval);
      })
      .onRequest(({ request, set, server }) => {
        if (request.url.includes("sw.js")) return;
        if (request.url === "http://e.ly/dokumentasi") return;
        const pathname = new URL(request.url).pathname;
        const ip = getClientIP(request, server);
        const clientThrottle = ThrolettleStore.get(ip);
        const delayMs = ttlToMs(hits.delay || "60s");
        if (!clientThrottle) {
          const expMs = ttlToDate(hits.ttl).getTime();
          ThrolettleStore.set(ip, { hits: { limit: 1, exp: expMs, delayMs, ignorePaths: [] } });
          return;
        }

        if (clientThrottle.hits.ignorePaths.find((s) => s.path === pathname)) return;

        if (clientThrottle.hits.exp < Date.now()) {
          const expMs = ttlToDate(hits.ttl).getTime();
          clientThrottle.hits = { ...clientThrottle.hits, limit: 1, exp: expMs, delayMs };
          ThrolettleStore.set(ip, clientThrottle);
          return;
        }

        if (clientThrottle.hits.limit >= hits.limit) {
          if (hits.delay) {
            const delayMs = ttlToMs(hits.delay);
            const waitTime = clientThrottle.hits.limit * delayMs;
            const resetTime = clientThrottle.hits.exp - Date.now();
            if (waitTime > resetTime) {
              throw new HttpException(`Too Many Requests, retry after ${Math.ceil(resetTime / 1000)} seconds`, 429);
            }
          }

          throw new HttpException("Too Many Requests", 429);
        }
        set.headers["X-RateLimit-Remaining"] = (hits.limit - clientThrottle.hits.limit).toString();
        clientThrottle.hits.limit += 1;
      })
      .as("global");
