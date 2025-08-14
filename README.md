# my-better-t-app-2

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Hono, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **tRPC** - End-to-end type-safe APIs
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **SQLite/Turso** - Database engine
- **Authentication** - Email & password authentication with Better Auth
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev # alias for `alchemy dev`
```

To deploy your application, run:

```bash
bun run deploy # alias for `alchemy deploy`
```

To destroy your application, run:

```bash
bun run destroy # alias for `alchemy destroy`
```

## Database Setup

This project uses SQLite with Drizzle ORM. The database, powered by Cloudflare D1, is automatically created and migrated by Alchemy when you run `alchemy dev` or `alchemy deploy`. No need to run any database commands manually.

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).


## Project Structure

```
my-better-t-app-2/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── server/      # Backend API (Hono, TRPC)
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application (warning: will need to set `VITE_SERVER_URL` in `.env` to the server URL)
- ~~`bun dev:server`: Start only the server~~ not supported by Alchemy; use `bun dev` instead
- `bun check-types`: Check TypeScript types across all apps
- ~~`bun db:push`: Push schema changes to database~~ handled by Alchemy
- ~~`bun db:studio`: Open database studio UI~~ let me know if you want me to show this; requires additional configuration for D1
- ~~`cd apps/server && bun db:local`: Start the local SQLite database~~ no need; handled by Alchemy
