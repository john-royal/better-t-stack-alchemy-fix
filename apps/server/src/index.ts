import { trpcServer } from "@hono/trpc-server";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import {
  createHonoContext,
  createTRPCContext,
  type HonoEnv,
} from "./lib/context";
import { appRouter } from "./routers/index";

// `createHonoContext` is a middleware that creates the database and auth instances and
// sets them on the Hono context, so they can be accessed using `c.get("auth")` and `c.get("db")`.
// see `lib/context.ts` for more details.
const app = new Hono().use(createHonoContext);

app.use(logger());
app.use(
  "/*",
  cors({
    // You can also use `import { env } from "cloudflare:workers";`, but this has to be in a
    // callback function because Cloudflare does not populate env at the top level.
    // You could also use `process.env` if the Workers compatibility flag is set correctly —
    // but explicit passing or `import { env }` is easier to type correctly.
    origin: (_, c: Context<HonoEnv>) => c.env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/**", (c) =>
  c.get("auth").handler(c.req.raw),
);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_, c) => {
      return createTRPCContext(c);
    },
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

// export default app; <-- This would work too, but showing this explicitly for clarity:
export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext) {
    return await app.fetch(request, env, ctx);
  },
};
