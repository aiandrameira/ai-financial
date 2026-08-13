---
name: architecture
description: Core rules for structuring a Bun + Elysia + Drizzle API into modules with domain/app/infra layers. Use this skill to determine exactly where a new backend resource (usecase, repository, controller, route, schema, dto) belongs within `src/modules/<module>`. It defines the folder structure, mandatory file naming conventions, the response envelope, and error handling. Triggers whenever creating or modifying a file within `src/modules`, `src/http`, or `src/db`.
license: MIT
metadata:
    author: [aiandralves](https://github.com/aiandralves)
    version: "1.1"
---

# API Architecture Guide for AIs

This document outlines the backend architecture, file structure, and naming conventions used in this project. As an AI assistant, you MUST follow these guidelines when creating or modifying files to ensure consistency across the API.

This is a **single-user** product — there is no `organization`/`workspace` module and never will be (decision recorded in `docs/planning.md` section 1). Every entity instead carries a `user_id`, present from the very first schema (Fase 1), so the eventual auth phase (Fase 7) only swaps a fixed dev value for a real one — no migration. See `docs/planning.md` (repo root) sections 3 and 4.1.1 for the full rationale.

## 0. Stack

- **Runtime**: Bun.
- **HTTP framework**: Elysia, composed as small `Elysia` instances (`.use(...)`) rather than a monolithic router.
- **Database**: PostgreSQL via Drizzle ORM.
- **Validation**: Zod (request bodies/queries) — this project targets Zod v4.
- **Auth**: none yet. Fase 7 of the roadmap (`docs/planning.md` section 3) adds it **embedded in this project**, adapting patterns from the sibling `ai-book` and `better-auth` repos — not a remote identity service. Until then, every entity's `user_id` is `env.DEV_USER_ID`, and no route requires a session.
- **Formatting**: Biome (`bun run format`).
- **Path alias**: `@/*` maps to `./src/*` (see `tsconfig.json`).

## 1. High-Level Structure

The API is organized as a set of **modules**, each implementing its own three-layer clean/hexagonal architecture. There is no shared "core"/"domain" at the app root — each module is self-contained and owns its full vertical slice.

```
src/
    ├── modules/                # One folder per bounded-context module
    │   └── <module>/
    │       ├── domain/         # Repository interfaces (contracts), no framework code
    │       ├── app/            # Use cases, DTOs, Zod schemas — orchestration + validation
    │       └── infra/          # Concrete implementations: controllers, Drizzle repos, routes
    ├── db/                     # Drizzle schema, migrations, db client
    ├── http/                   # Cross-cutting HTTP concerns shared by all modules
    │   ├── api/                # Response envelope, shared Zod schemas (pagination, etc.)
    │   ├── errors/              # AppError hierarchy
    │   └── uploads/            # Generic Cloudinary upload route
    ├── jobs/                   # Scheduled/cron jobs (@elysiajs/cron), added as needed
    ├── env.ts                  # Typed environment access
    └── index.ts                # Composition root: builds the Elysia app, registers module routes
```

The domain modules planned for this product (per `docs/planning.md` sections 4 and 5) are, in roadmap order: `account` (contas + transações + transferências + recorrências), `credit-card` (cartões, faturas, parcelamento) + `budget`, `loan` (financiamentos), `investment`, `goal` (metas + bens), `dashboard` (relatórios). None exist yet — created incrementally starting at Fase 1. Every entity in every module carries a `user_id` — see the auth note in section 0.

## 2. Naming Conventions and General Rules

- **Files**: `kebab-case`, one primary export per file (e.g., `create-account.usecase.ts`, `account.repository.ts`).
- **Classes**: `PascalCase` (e.g., `CreateAccountUseCase`, `AccountDrizzleRepository`).
- **Suffixes are mandatory and describe the layer**:
  - `*.usecase.ts` → class named `<Verb><Entity>UseCase`, single public `execute(...)` method.
  - `*.repository.ts` → interface named `<Entity>Repository`, lives in `domain/repositories/`.
  - `*.drizzle.ts` → class named `<Entity>DrizzleRepository implements <Entity>Repository`, lives in `infra/repositories/`.
  - `*.controller.ts` → class named `<Entity>Controller`, lives in `infra/controllers/`.
  - `*.routes.ts` → exports a named `const <entity>Routes = new Elysia(...)`, lives in `infra/routes/`.
  - `*.schema.ts` → Zod schema(s) + inferred type(s), lives in `app/schemas/`.
  - `*.dto.ts` → plain TypeScript interface describing data shape returned to callers, lives in `app/dtos/`.
- **Repository method names** (mirrors the interface contract across all modules):
  - `find`: paginated list → returns `IPaginated<T>`.
  - `findBy*`: unpaginated list of related resources (e.g., `findByAccount`).
  - `get`: single item by id → `T | null`.
  - `getBy*`: single related item.
  - `create` / `update` / `delete`: mutations.
  - Verb-first custom actions when CRUD doesn't fit (e.g., `markAsPaid`, `cancelTransaction`).
- **Private fields**: use `private` constructor-parameter properties for injected dependencies (e.g., `constructor(private repository: AccountRepository) {}`); this project does not use `#`-private fields in the API (unlike the frontend).
- **Imports**: use the `@/` alias for cross-module and `src/http`/`src/db` imports; use relative imports (`../../domain/...`) within a module's own layers.

## 3. Domain Layer (`domain/`)

The innermost layer. Contains **only interfaces** — no Drizzle, no Elysia, no I/O.

- **Repositories (`domain/repositories/`)**: One interface per aggregate/entity, named `<Entity>Repository`. Methods return `Promise<Dto>` / `Promise<Dto[]>` / `Promise<IPaginated<Dto>>`, never ORM row types directly.
- Domain files commonly re-export the DTO types they reference via `export type { ... }` so consumers can import both the repository and its shapes from one place.

```ts
// domain/repositories/account.repository.ts
export interface AccountRepository {
  find(
    userId: string,
    params?: PaginationParams,
  ): Promise<IPaginated<AccountListItemDto>>;
  get(userId: string, id: string): Promise<AccountDto | null>;
  create(userId: string, body: CreateAccountSchema): Promise<AccountDto>;
  update(id: string, body: UpdateAccountSchema): Promise<void>;
  delete(id: string): Promise<void>;
}
```

## 4. App Layer (`app/`)

Orchestration and validation. Depends on `domain/` interfaces only — never on `infra/` concrete classes.

- **Usecases (`app/usecases/`)**: One class per action, single responsibility, named `<Verb><Entity>UseCase`. Constructor takes the repository interface(s) it needs (its own module's, and/or another module's domain repository — cross-module dependencies are allowed and common, e.g. a `transaction` usecase depending on `account/domain/repositories/account.repository.ts`). All business rules and cross-entity checks (existence, conflicts, ownership) live here, not in controllers or repositories.

```ts
// app/usecases/create-transaction.usecase.ts
export class CreateTransactionUseCase {
  constructor(
    private repository: TransactionRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute(
    userId: string,
    body: CreateTransactionSchema,
  ): Promise<TransactionDto> {
    const account = await this.accountRepository.get(userId, body.accountId);
    if (!account) throw new NotFoundError("Account not found");
    return this.repository.create(userId, body);
  }
}
```

- **Schemas (`app/schemas/`)**: Zod object schemas for request bodies/queries, named `<verb><Entity>Schema` (e.g., `createAccountSchema`, `updateTransactionSchema`), each paired with an inferred type export (`export type CreateAccountSchema = z.infer<typeof createAccountSchema>`).
- **DTOs (`app/dtos/`)**: Plain interfaces describing what the API returns. Prefer a distinct `*-list-item.dto.ts` for paginated list rows when the list shape is leaner than the full entity DTO (e.g., `AccountListItemDto` vs `AccountDto`).

## 5. Infra Layer (`infra/`)

Concrete, framework-touching implementations. This is the only layer allowed to import Drizzle, Elysia, and other modules' `infra/` classes.

- **Repositories (`infra/repositories/*.drizzle.ts`)**: Implement the module's `domain` repository interface using `db` (Drizzle client) and the tables from `src/db/schema/`. Map query results to DTOs explicitly in the `select({...})` projection — don't leak raw table row types past this layer.
- **Controllers (`infra/controllers/*.controller.ts`)**: Thin adapters between HTTP and usecases. Constructor takes a typed map of usecases (`type UseCases = { find: FindXUseCase; get: GetXUseCase; ... }`). Each method calls exactly one usecase and wraps the result with `ApiResponse` (`.paginated`, `.list`, `.item`, `.success`), or sets `set.status` directly for no-content responses (e.g., `204` on delete). No business logic here.
- **Routes (`infra/routes/*.routes.ts`)**: The composition root for the module's HTTP surface.
  - A local `buildController()` function `new`s up the concrete Drizzle repositories and usecases and wires them into the controller. This is the one place `new` is called for these classes.
  - The exported `const <entity>Routes = new Elysia({ prefix: "/<entities>", tags: ["<Entities>"] })` chains one HTTP method call per endpoint. Until Fase 7 (auth), handlers read `env.DEV_USER_ID` in place of a session-derived user id.
  - Every endpoint should get a Zod `body`/`query` schema when applicable, plus an OpenAPI `detail: { summary, description, responses }` block.

```ts
// infra/routes/account.routes.ts
function buildController() {
  const repository = new AccountDrizzleRepository();
  return new AccountController({
    find: new FindAccountsUseCase(repository),
    get: new GetAccountUseCase(repository),
    // ...
  });
}

const controller = buildController();

export const accountRoutes = new Elysia({
  prefix: "/accounts",
  tags: ["Accounts"],
}).get("/", ({ query }) => controller.find(env.DEV_USER_ID, query), {
  query: paginationQuerySchema,
  detail: {
    summary: "List accounts",
    description: "...",
    responses: { 200: { description: "..." } },
  },
});
```

## 6. Cross-Cutting HTTP Layer (`src/http/`)

- **`http/api/response.ts`**: The `ApiResponse` envelope factory — every response body is `{ data, meta: { message, status, type } }` (plus `page`/`size`/`total` for paginated/list responses). Always return through `ApiResponse.*` from controllers; never hand-roll a response shape.
- **`http/api/schema/`**: Shared Zod schemas reused across modules (e.g., `paginationQuerySchema` / `PaginationParams`).
- **`http/errors/errors.ts`**: `AppError` base class carrying an HTTP `status`, with subclasses per case (`NotFoundError` 404, `ConflictError` 409, `ValidationError` 400, `UnauthorizedError` 401). Usecases `throw` these; a single `.onError(...)` handler in `src/index.ts` catches them, reads `.status`/`.message`, and returns `ApiResponse.error(...)`. Add new subclasses here rather than throwing plain `Error`/status codes ad hoc.
- **`http/plugins/`**: doesn't exist yet. Fase 7 adds an auth plugin here (embedded session/user resolution, adapted from `ai-book`/`better-auth`) — see `docs/planning.md` section 3. Until then, don't add auth macros; handlers use `env.DEV_USER_ID` directly.

## 7. Database Layer (`src/db/`)

- **`db/schema/*.ts`**: One file per table, `pgTable("<snake_case_table>", { ... })`, exported as a `camelCase` plural const (e.g., `export const accounts = pgTable("accounts", {...})`). Primary keys are `text("id").primaryKey().$defaultFn(() => randomUUIDv7())`. Re-export every table from `db/schema/index.ts`.
- **`db/migrations/`**: Generated by `drizzle-kit` (`bun run db:generate` / `db:migrate` / `db:push`) — do not hand-edit generated SQL.
- **`db/client.ts`**: The single shared `db` Drizzle client instance imported by every `*.drizzle.ts` repository.

## 8. Module Wiring & Boundaries

- `domain` → depends on nothing (pure interfaces + DTOs/schemas types).
- `app` → depends on `domain` (its own module's, and other modules' domain interfaces when a usecase needs cross-module data). Never imports another module's `infra`.
- `infra` → depends on `app` + `domain` of its own module, and may import **other modules' `infra`** (concrete Drizzle repositories, usecases) purely for wiring in `*.routes.ts` composition roots. This is the only layer allowed to reach across modules concretely.
- `src/index.ts` is the top-level composition root: registers global plugins (`cors`, `openapi`, `.onError`) and mounts every module's `*.routes.ts` via `.use(...)`.

## 9. Coding Standards Checklist for AIs

When generating new code in this project:

- **New endpoint** → add (as needed) a DTO, a Zod schema, a usecase, a repository method (interface + Drizzle impl), a controller method, and a route — in that dependency order.
- **Business rules** (existence checks, conflicts, authorization beyond permission strings) belong in the **usecase**, not the controller or the Drizzle repository.
- **Errors**: throw the specific `AppError` subclass (`NotFoundError`, `ConflictError`, etc.) from `http/errors/errors.ts`; let `src/index.ts`'s `.onError` translate it — don't catch-and-format errors manually in controllers.
- **Responses**: always go through `ApiResponse.paginated/list/item/success/error`.
- **User scoping**: every module's queries must be scoped by `userId` — `env.DEV_USER_ID` until Fase 7 adds real auth, never a client-supplied id trusted as-is.
- **Repositories**: never return raw Drizzle row/table types from a `domain` interface method — always map to a DTO in the `.drizzle.ts` implementation.
- **Validation**: request bodies/queries are validated by Zod schemas passed to Elysia's `body`/`query` route options — don't manually validate inside usecases/controllers.
- **Testing**: this project has no test suite yet; if adding one, colocate `*.spec.ts`/`*.test.ts` next to the file under test, matching Bun's test runner conventions.
