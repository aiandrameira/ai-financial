# API Development Agent

You are an expert in TypeScript, Bun, Elysia, Drizzle ORM, and scalable backend API development. You write functional, maintainable, secure, and well-typed code following this project's architecture and conventions.

## Required References

Before generating code:

1. Read every `SKILL.md` file found under `.agents/skills/**`;
2. Apply architecture rules from `.agents/skills/architecture/SKILL.md`;
3. Prefer consistency with the existing module's structure over introducing new patterns;
4. For product/domain context (why a module exists, what it's for), read `docs/planning.md` at the repo root.

## Identity & auth

This is a **single-user** product — never add an `organization`/`workspace` module. Every entity carries a `user_id` from the first schema onward (Fase 1), pointing at `env.DEV_USER_ID` until Fase 7 adds real auth, built **inside this project** (not a remote identity service), adapting patterns from the sibling `ai-book`/`better-auth` repos. See `.agents/skills/architecture/SKILL.md` section 0 and `docs/planning.md` sections 3 and 4.1.1.

## Architecture

- Follow the module structure (`domain/` → `app/` → `infra/`) defined in `.agents/skills/architecture/SKILL.md`;
- Never bypass layer boundaries: `domain` has no framework dependencies, `app` depends only on `domain`, `infra` is the only layer that touches Drizzle/Elysia and reaches into other modules' concrete implementations;
- One usecase per action, one repository interface per aggregate, thin controllers, routes as the composition root.

## TypeScript Best Practices

- Use `strict` type checking;
- Prefer type inference when the type is obvious;
- Avoid the `any` type; use `unknown` when type is uncertain;
- Prefer immutable data structures and pure functions when possible;
- Use descriptive and domain-oriented naming;
- Use `type`-only imports (`import type { ... }`) for types/interfaces to keep runtime imports minimal.

## Elysia / HTTP

- Compose the app from small `Elysia` instances (`.use(...)`), never a monolithic router;
- Validate request bodies/queries with Zod schemas passed to Elysia's `body`/`query` options — don't hand-validate in usecases or controllers;
- Every route includes an OpenAPI `detail: { summary, description, responses }` block;
- Always respond through `ApiResponse.paginated/list/item/success/error` — never hand-roll a response shape;
- Throw the specific `AppError` subclass (`NotFoundError`, `ConflictError`, `ValidationError`, `UnauthorizedError`) from `http/errors/errors.ts` and let the global `.onError` handler in `src/index.ts` translate it — don't catch-and-format errors manually in controllers.

## Database (Drizzle)

- One table per file under `db/schema/`, re-exported from `db/schema/index.ts`;
- Never return raw Drizzle row/table types from a `domain` repository interface — map to a DTO explicitly in the `.drizzle.ts` implementation's `select({...})` projection;
- Generate migrations via `bun run db:generate` / apply via `db:migrate` — never hand-edit generated SQL;
- Import the shared `db` client from `db/client.ts`; don't instantiate a second client.

## Clean Architecture

- Keep business rules (existence checks, conflicts, cross-entity validation) in usecases, not controllers or repositories;
- Controllers are thin adapters: call exactly one usecase, wrap the result with `ApiResponse`, no business logic;
- Depend on abstractions (`domain` repository interfaces), not concrete implementations, from the `app` layer;
- Cross-module usecase dependencies are fine at the `app` layer (importing another module's `domain` interfaces); cross-module concrete wiring only happens in `infra/routes/*.routes.ts` composition roots.

## Security

- Never log or return secrets, tokens, or password hashes;
- Every module-owned resource must be scoped by `userId` — `env.DEV_USER_ID` until Fase 7 adds real auth, never a client-supplied id trusted as-is;
- Validate all external input with Zod before it reaches a usecase.
