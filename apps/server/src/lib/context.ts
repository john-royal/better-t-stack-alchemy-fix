import { createDatabase, type Database } from "@/db";
import type { Env, Context as HonoContext } from "hono";
import { createMiddleware } from "hono/factory";
import { createAuth, type Auth } from "./auth";

export interface HonoEnv extends Env {
  Bindings: CloudflareEnv; // accessible via c.env (and `import { env } from "cloudflare:workers"`)
  Variables: { auth: Auth; db: Database }; // accessible via c.get("auth") and c.get("db")
}

// The `createMiddleware` helper ensures that the Hono context is correctly typed.
export const createHonoContext = createMiddleware<HonoEnv>(async (c, next) => {
  const db = createDatabase();
  const auth = createAuth(db);
  c.set("auth", auth);
  c.set("db", db);
  await next();
});

export async function createTRPCContext(c: HonoContext<HonoEnv>) {
  const session = await c.get("auth").api.getSession({
    headers: c.req.raw.headers,
  });
  return {
    session,
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
