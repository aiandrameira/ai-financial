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
- **Enums**:
  - `tp-` for types/enums (e.g., `tp-transaction-status.enum.ts`)
  - `st-` for status (e.g., `st-invoice.enum.ts`)
  - `lg-` for logical flags (e.g., `lg-active.enum.ts`)
  - Associated maps should be exported (e.g., `export const tpTransactionStatusMap = new Map(...)`).
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
- **UI (`core/ui/`)**: Atomic, reusable UI components that do not depend on specific business logic. Prefer `@aiandralves/ai-ui` components first — only build a custom one here when the design system doesn't cover the need.

Structure:

```
core/
    ├── utils/                          # Pure functions and helpers
    │   └── string.util.ts              # e.g., `string.util.ts`
    ├── helpers/                        # Functions that may depend on Angular but are not specific to business logic
    │   └── format-dayjs.helper.ts      # e.g., `formatDayjs.helper.ts`
    ├── pipes/                          # Reusable Angular pipes
    │   └── tp-transaction-status.pipe.ts
    └── ui/                             # Atomic, reusable UI components
        └── components/                 # Reusable components
```

## 4. Domain Layer (`domain/`)

- **Schemas (`domain/schemas/`)**: Use `zod` for validation. Export the schema, the TypeScript type inferred via `z.infer`, and a factory function (e.g., `makeTransaction`) to parse raw data and instantiate default states for UI;
- **Repositories (`domain/repositories/`)**: Interfaces defining data contracts returning Observables (e.g., `TransactionRepository`);
- **Filters (`domain/filters/`)**: Implement classes that handle search criteria, using `zod` for prop validation to mount query params;
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
        └── tp-entity.enum.ts           # e.g., `tp-transaction-status.enum.ts`
```

## 5. Infra Layer (`infra/`)

- **Services (`infra/services/`)**: Implement Domain Repository interfaces. Handle HTTP requests (using `#client = inject(HttpClient)`), pointed at `ai-financial/api` (`environment.apiUrl`). Group files by entity (e.g., `services/transaction/transaction.service.ts` and `.spec.ts`);
- **Facades (`infra/facades/`)**: Encapsulate logic for external services to avoid bloating components, orchestrating Services and signal-based state: `providedIn: 'root'`, a private writable signal, a public `.asReadonly()`, `load()`/mutation methods that resubscribe.

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
