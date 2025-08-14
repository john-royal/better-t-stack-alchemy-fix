import type { Database } from "@/db";
import * as schema from "@/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "cloudflare:workers";

// This has to be a function because Cloudflare does not populate env at the top level.
// You can also manually pass in the env object. For example:
//  const createAuth = (env: CloudflareEnv, db: Database) => ...
export const createAuth = (db: Database) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
  });

export type Auth = ReturnType<typeof createAuth>;
