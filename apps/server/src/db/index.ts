import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

// This has to be a function because Cloudflare does not populate env at the top level.
// You can also manually pass in the env object. For example:
//  const createDatabase = (env: CloudflareEnv) => drizzle({ ... })
export const createDatabase = () => drizzle(env.DB);

export type Database = ReturnType<typeof createDatabase>;
