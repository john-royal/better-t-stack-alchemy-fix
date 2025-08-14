import { defineConfig } from "drizzle-kit";

// This is only used to generate migrations. The rest is handled by Alchemy.
export default defineConfig({
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  dialect: "sqlite",
});
