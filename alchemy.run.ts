import alchemy from "alchemy";
import {
  Vite,
  Worker,
  getAccountSubdomain,
  createCloudflareApi,
  D1Database,
} from "alchemy/cloudflare";
import { Exec } from "alchemy/os";
import { RandomString } from "alchemy/random";

const app = await alchemy("my-better-t-app-2");

// 1. D1 does not support `drizzle-kit push` yet, so we need to run `drizzle-kit generate`.
// Migrations are handled automatically by Alchemy by setting the `migrationsDir` option.
await Exec("db-generate", {
  cwd: "apps/server",
  command: "bun run drizzle-kit generate",
});

// 2. Create the D1 database.
const db = await D1Database("db", {
  // Alchemy handles D1 migrations automatically when this option is set.
  migrationsDir: "apps/server/src/db/migrations",

  // When running `alchemy dev`, Alchemy emulates the database locally.
  // To use the remote database even in development, uncomment the following line:
  // dev: { remote: true },
});

// 3. Generate a random secret for the better-auth server
const betterAuthSecret = await RandomString("better-auth-secret", {
  length: 32,
});

// 4. If we are running remotely, grab the workers.dev subdomain for your account; otherwise return null.
// This is used to fill in the BETTER_AUTH_URL and CORS_ORIGIN bindings, since we don't know the URL ahead of time.
const subdomain = app.local
  ? // if you are running locally, you don't have a subdomain; we use localhost instead
    null
  : // otherwise, fetch the `workers.dev` subdomain for your account (warning: may fail if subdomain is not enabled)
    await createCloudflareApi().then(async (api) => {
      return await getAccountSubdomain(api);
    });

// 5. Create the server
export const server = await Worker("server", {
  name: `${app.name}-${app.stage}-server`,
  cwd: "apps/server",
  entrypoint: "src/index.ts",
  bindings: {
    BETTER_AUTH_SECRET: betterAuthSecret.value,

    // Set BETTER_AUTH_URL to expected server URL
    BETTER_AUTH_URL: app.local
      ? "http://localhost:3000"
      : `https://${app.name}-${app.stage}-server.${subdomain}.workers.dev`,

    // Set CORS origin to expected web app URL
    CORS_ORIGIN: app.local
      ? "http://localhost:3001"
      : `https://${app.name}-${app.stage}-web.${subdomain}.workers.dev`,

    DB: db,
  },
  dev: {
    port: 3000,
  },
});

// 6. Create the web app
export const website = await Vite("web", {
  name: `${app.name}-${app.stage}-web`,
  cwd: "apps/web",
  build: "turbo -F web build",

  // If you run this through Turborepo, you might have a problem with the port after changing `alchemy.run.ts`. We have an update in the works to fix this.
  dev: "bun vite dev --port=3001",

  assets: "dist",
  env: {
    VITE_SERVER_URL: server.url!,
  },
});

console.log(`Server: ${server.url}`);
console.log(`Website: ${website.url}`);

// 7. Verify that our expected URLs match the actual URLs.
if (server.url !== server.bindings.BETTER_AUTH_URL) {
  console.warn(
    `Server URL mismatch: expected "${server.bindings.BETTER_AUTH_URL}" but got "${server.url}". This may cause issues with the better-auth server.`,
  );
}
if (
  website.url?.replace(/\/$/, "") !== // `website.url` is inferred from Vite and may include a trailing slash, so we remove it here. Probably a good idea to handle this automatically in Alchemy.
  server.bindings.CORS_ORIGIN
) {
  console.warn(
    `Website URL mismatch: expected "${server.bindings.CORS_ORIGIN}" but got "${website.url}". This may cause CORS issues.`,
  );
}

await app.finalize();
