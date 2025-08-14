import type { server } from "../../alchemy.run";
import "@cloudflare/workers-types";

declare global {
  // infer types automatically from the `server` resource in `alchemy.run.ts`
  type CloudflareEnv = typeof server.Env;
}

declare module "cloudflare:workers" {
  namespace Cloudflare {
    // populate `Cloudflare.Env` so `import { env } from "cloudflare:workers"` is correctly typed
    export interface Env extends CloudflareEnv {}
  }
}
