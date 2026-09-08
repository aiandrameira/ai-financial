---
name: architecture
description: Core rules for structuring an Angular workspace into core, domain, infra, and presentation directories. Use this skill to determine exactly where a new Angular resource belongs within the `apps/web/src/app` folder. It defines the folder structure, mandatory file naming conventions, and patterns like Zod schemas, Facades, dumb/smart components, and the usage of Signals and inject(). Triggers whenever creating or modifying a file within `apps/web/src/app`.
license: MIT
metadata:
    author: [aiandralves](https://github.com/aiandralves)
    version: "1.0"
---

# Angular Architecture Guide for AIs

This document outlines the specific Angular architecture, file structure, and naming conventions used in this project. As an AI assistant, you MUST follow these guidelines when creating or modifying files to ensure consistency across the application.

This is a **single-user** product with no login yet. Auth is Fase 7 of the roadmap (`docs/planning.md` section 3), embedded in this project and adapted from the sibling `ai-book`/`better-auth` repos — not a remote identity library. Don't add local auth/session logic to work around this; there is no session to guard against until Fase 7.

## 1. High-Level Folder Structure

The application strictly uses four layers, each with specific responsibilities:

- **`core/`**: Utilities, helpers, pipes, and atomic UI components.
- **`domain/`**: Business logic, models, validation schemas, filters, enums, and repository interfaces. Independent of frameworks.
- **`infra/`**: Concrete implementations: external services, adapters, and facades.
- **`views/`**: UI layer containing pages, visual components, and routes. Depends only on `domain/` and `infra/`.

The product modules planned for this app (per `docs/planning.md` sections 4 and 7.1) are: `dashboard`, `transacoes` (transactions/transfers), `contas` (accounts), `cartoes` (credit cards/invoices), `planejamento` (budgets/goals), `patrimonio` (investments/assets/loans), `relatorios` (reports). None exist as `views/` submodules yet — the app itself hasn't been generated (see `docs/planning.md` checklist). No route guards exist until Fase 7 adds auth.

## 2. Naming Conventions and General Rules

- **Files**: Singular and `kebab-case` (e.g., `transaction.service.ts`).
- **Classes**: `PascalCase` (e.g., `TransactionService`).
- **Variables/Functions**: `camelCase` (e.g., `getTransactionById`).
- **Private Methods**: Must be prefixed with an underscore (`_`) to clearly distinguish them from private properties (e.g., `private _loadTransaction()`).
- **Private Properties**: Must use ECMAScript private fields (`#`) instead of the `private` keyword (e.g., `#apiUrl = ''`, `#http = inject(HttpClient)`).
- **Enums**: a fixed set of string values is always a real TypeScript `enum`, never an inline string-literal union or a bare `z.enum([...])`. File and enum name share the same prefix, and the prefix is never repeated as a word in the name (it already says what kind it is):
  - `tp-` for a type/category (e.g., `tp-transaction.enum.ts` → `export enum tpTransactionEnum { INCOME = "income", EXPENSE = "expense", TRANSFER = "transfer" }` — not `tpTransactionTypeEnum`)
  - `st-` for a status/lifecycle state (e.g., `st-transaction.enum.ts` → `export enum stTransactionEnum { PLANNED = "planned", ... }` — not `tpTransactionStatusEnum`)
  - `lg-` for logical flags (e.g., `lg-active.enum.ts`)
  - Associated display maps are a `Map`, named `<prefix><Entity>Map`, exported next to the enum (e.g., `export const tpTransactionMap = new Map<tpTransactionEnum, string>([[tpTransactionEnum.INCOME, "Receita"], ...])`) — not a `Record`/object literal.
- **Repository Methods**:
  - `find`: returns a list
  - `get`: returns a single item
  - `create`: creates an entity
  - `update`: updates an entity
  - `remove`: deletes an entity
  - `download`: downloads files
  - `findBy*`: list of related resources
  - `getBy*`: single related resource
- **Dependency Injection**: Always use `inject()` function over constructor injection.

## 3. Core Layer (`core/`)

- **Utils (`core/utils/`)**: Pure functions and helpers that are framework-agnostic;
- **Helpers (`core/helpers/`)**: Functions that may depend on Angular but are not specific to business logic (e.g., `formatDayjs`, `handleError`);
- **Pipes (`core/pipes/`)**: Reusable Angular pipes for formatting and transforming data in templates;
- **UI (`core/ui/`)**: Reusable, business-agnostic UI built on top of `@aiandralves/ai-ui` — only build one here when the design system doesn't cover the need. Selector prefix is `ai-`, not `app-` (the app-wide ESLint `component-selector`/`directive-selector` rules allow both) — this marks it as design-system-level, matching `@aiandralves/ai-ui`'s own `ai-*` components and the sibling `ai-auth` project's own `ai-sidenav`. Two kinds of subfolder:
  - **`core/ui/lib/`**: code brought over verbatim from another project (currently `api-response/`, `filter/`, copied from `ai-auth` — see the Code Style section's note on that pattern). Don't add new things here casually; it's specifically for adopted shared code.
  - **`core/ui/<feature>/`** (sibling to `lib/`, not inside it): components we build ourselves — e.g. `layout/sidenav/`, `filter-select/`. A component with real state/services mirrors `ai-auth`'s layered pattern (`core/components/`, `domain/schemas/`, `infra/services/`) — see `ai-sidenav` for the reference shape, and its `SIDENAV.md`-equivalent thinking (state lives in a service, persisted via `core/utils/local-storage-signal.util.ts`, not in the component). A simple, stateless component (like `FilterSelect`) stays flat — don't force the three-layer split where there's no real state to separate out.

Structure:

```
core/
    ├── utils/                          # Pure functions and helpers
    │   └── string.util.ts              # e.g., `string.util.ts`
    ├── helpers/                        # Functions that may depend on Angular but are not specific to business logic
    │   └── format-dayjs.helper.ts      # e.g., `formatDayjs.helper.ts`
    ├── pipes/                          # Reusable Angular pipes
    │   └── st-transaction.pipe.ts
    └── ui/
        ├── lib/                        # Adopted shared code (currently from ai-auth)
        │   ├── api-response/
        │   └── filter/
        ├── layout/
        │   └── sidenav/
        │       ├── core/components/    # ai-sidenav
        │       ├── domain/schemas/     # SidenavGroup, SidenavItem, SidenavUser
        │       └── infra/services/     # SidenavService (collapsed state, persisted)
        └── filter-select/              # ai-filter-select — flat, no state to layer out
```

## 4. Domain Layer (`domain/`)

- **Schemas (`domain/schemas/`)**: Use `zod` for validation. Export the schema, the TypeScript type inferred via `z.infer`, and a factory function (e.g., `makeTransaction`) to parse raw data and instantiate default states for UI;
- **Repositories (`domain/repositories/`)**: Interfaces defining data contracts returning Observables (e.g., `TransactionRepository`);
- **Filters (`domain/filters/`)**: One class per entity for typed query filtering and cursor pagination, wrapping a `FilterProps<Props>` from `@core/ui` and exposing `getFilters(): FilterManager` (see `core/ui/lib/filter/filter.md`). Only add one when there's a real filter surface (e.g. `TransactionFilter` for account/category/status/date-range) — plain pagination-only lists just pass `{ page, size }` directly, no filter class needed;
- **Enums (`domain/enums/`)**: Definition of constant values and maps for UI display.

Structure:

```
domain/
    ├── schemas/                        # Zod schemas with inferred types and factory functions
    │   └── entity.schema.ts            # e.g., `transaction.schema.ts`
    ├── repositories/                   # Repository interfaces returning Observables
    │   └── entity.repository.ts        # e.g., `transaction.repository.ts`
    ├── filters/                        # Filter classes using zod
    │   └── entity.filter.ts            # e.g., `transaction.filter.ts`
    └── enums/                          # Enums and associated maps for UI
        └── tp-entity.enum.ts           # e.g., `tp-transaction.enum.ts`, `st-transaction.enum.ts`
```

## 5. Infra Layer (`infra/`)

- **Services (`infra/services/`)**: Implement Domain Repository interfaces. Handle HTTP requests (using `#client = inject(HttpClient)`, `#api = environment.apiUrl.concat("/entities")`), pointed at `ai-financial/api`. Unwrap the API's response envelope with `mapGet`/`mapFind`/`mapCursorPaginated` from `@core/ui` inside `.pipe(map(...))` — never read `response.data` by hand. Group files by entity (e.g., `services/transaction/transaction.service.ts` and `.spec.ts`);
- **Facades (`infra/facades/`)**: Encapsulate logic for external services to avoid bloating components, orchestrating Services and signal-based state: `providedIn: 'root'`, `CursorPaginationState`, `rxResource`, and `toLastGoodCursorPage`; mutations reset and reload the list. Tables use `toAiTablePagination` and the shared cursor controllers (see `docs/pagination.md` at the repository root).

_Note: Provide barrel files (`index.ts`) for public folders to export relevant symbols._

Structure:

```
infra/
    ├── services/
    │   └── entity/                     # Grouped by entity (e.g., `transaction/`)
    │       ├── entity.service.ts
    │       └── entity.service.spec.ts
    └── facades/                        # Facades for external services
        └── entity.facade.ts
```

## 6. Views Layer (`views/`)

The views layer orchestrates the UI using dumb and smart components, using modern Angular features like **Signals** (`signal()`, `computed()`), Signal inputs (`input()`, `output()`).

Structure:

```
views/
    └── module/                 # Feature module (e.g., `transacoes`, `contas`)
        ├── pages/               # Page components (e.g., `list-transactions.page.ts`)
        ├── components/          # Reusable visual components (e.g., `table-transaction.ts`)
        ├── resolvers/           # Route resolvers (e.g., `get-transaction.resolver.ts`)
        └── <module>.routes.ts   # Route definitions for the module (e.g., `transaction.routes.ts`)
```

## 7. Coding Standards Checklist for AIs

When generating new code in this project:

- **Standalone Components:** DO NOT use `standalone: true`;
- **Imports:** Use absolute-like or relative paths correctly, keeping boundaries strict (Views can import from Core/Domain/Infra, but Core NEVER imports from Views);
- **State Management:** Prioritize using Angular **Signals** (`signal()`, `computed()`, `effect()`) for state over Observables/BehaviorSubjects;
- **Dependency Injection:** Use the `inject()` function pattern over constructor injection;
- **Forms:** Use signal-based forms (e.g., `form()`, `FormField`) when building inputs;
- **Private Properties:** Use ECMAScript private fields (`#property`) instead of the `private` keyword.
- **Private Methods:** Prefix private methods with an underscore (`private _methodName()`).
- **Design system:** Use `@aiandralves/ai-ui` components first (see `DESIGN.md`) — don't build a parallel component for something the design system already covers.

## 8. Code Style

- **No comments.** Naming and structure carry the intent. The only exception is genuinely shareable, library-style code where a comment documents usage for a consumer — narrow and rare.
- **`index.ts` barrels**: every `domain/repositories/`, `domain/schemas/`, `infra/services/`, and `infra/facades/` folder re-exports its contents from an `index.ts`. Import from the barrel outside the folder, not the individual file.
- **Extract reusable functions** into `core/utils/` or `core/helpers/` (section 3) instead of inlining them in a component or service — especially anything more than one view needs.
- **English only** for identifiers, file/folder names, route paths, and any (rare) comment. **Portuguese only for text actually shown to the user** — labels, placeholders, button text, toasts, validation messages.
- **Singular, always** (repeats section 2, called out because it's the easiest rule to slip on): pages, routes, services, view/feature folders, components. `list-transaction.page.ts`, `transaction.routes.ts`, `form-transaction`, `table-transaction`, `transaction.service.ts` — never the plural.
