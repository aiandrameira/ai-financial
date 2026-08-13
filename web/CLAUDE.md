# Angular Development Agent

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Required References

Before generating code:

1. Read `DESIGN.md`;
2. Read every `SKILL.md` file found under `.agents/skills/**`;
3. Apply architecture rules from `.agents/skills/architecture/SKILL.md`;
4. Apply UI rules from `DESIGN.md`;
5. If rules conflict:
   - `AGENTS.md` has highest priority;
   - `architecture/SKILL.md` has priority over implementation details;
   - `DESIGN.md` has priority over visual decisions.

## Identity & auth

There is no login yet. This is a **single-user** product (`docs/planning.md` section 1) — auth is Fase 7 of the roadmap, built **inside this project** (not a remote identity service), adapting patterns from the sibling `ai-book` (Cloudinary avatar upload) and `better-auth` repos. Don't hand-roll auth/session/guard code before that phase — there's no session to protect yet. See `docs/planning.md` section 3 for the full plan.

## Tailwind — required `@source`

`styles.scss` needs an `@source` directive for `@aiandralves/ai-ui`:

```scss
@source "../../../node_modules/@aiandralves/ai-ui";
```

It's an installed `node_modules` package, which Tailwind does **not** scan by default. Without this `@source` line, classes used only inside that package's component templates never get generated, silently breaking layout with no console error to point at it.

## Architecture

- Follow the architecture defined in `.agents/skills/architecture/SKILL.md`;
- Never bypass architectural boundaries for convenience;
- Respect layer responsibilities and dependency direction;
- Prefer consistency with the existing project architecture over introducing new patterns.

## TypeScript Best Practices

- Use `strict` type checking;
- Prefer type inference when the type is obvious;
- Avoid the `any` type; use `unknown` when type is uncertain;
- Prefer immutable data structures and pure functions when possible;
- Use descriptive and domain-oriented naming.

## Angular Best Practices

- Assume Angular v21+ APIs and conventions unless explicitly stated otherwise;
- Always use standalone components over `NgModules`;
- Must NOT set `standalone: true` inside Angular decorators. It's the default;
- Use signals for state management;
- Implement lazy loading for feature routes;
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead;
- Use `NgOptimizedImage` for all static images
  - `NgOptimizedImage` does not work for inline base64 images.

### Components

- Keep components small and focused on a single responsibility;
- Use `input()` and `output()` functions instead of decorators;
- Use `computed()` for derived state;
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator;
- When using Tailwind CSS, prefer utility classes over custom CSS/SCSS files;
- Create CSS/SCSS files only when Tailwind utilities cannot adequately express the styling;
- Use inline templates only when the template is short and easily readable within the component file;
- Use external HTML files for medium or large templates;
- Prefer Reactive forms instead of Template-driven ones;
- Do NOT use `ngClass`, use `class` bindings instead;
- Do NOT use `ngStyle`, use `style` bindings instead;
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state;
- Use `computed()` for derived state;
- Keep state transformations pure and predictable;
- Do NOT use `mutate` on signals, use `update` or `set` instead;
- Avoid unnecessary state duplication.

## Templates

- Keep templates simple and avoid complex logic;
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`;
- Use the `async` pipe to handle observables;
- Do NOT assume globals like (`new Date()`) are available;
- Do NOT write arrow functions in templates (they are not supported);
- Move complex view logic to computed signals or component methods.

## Services

- Design services around a single responsibility;
- Use the `providedIn: 'root'` option for singleton services;
- Use the `inject()` function instead of constructor injection;
- Keep services focused on orchestration, infrastructure, or state management responsibilities.

## Clean Architecture

- Keep domain logic independent from Angular framework concerns;
- Prefer use cases over business logic inside components;
- Components should orchestrate, not implement business rules;
- Infrastructure concerns must remain outside domain logic;
- Depend on abstractions, not implementations;
- Keep business rules framework-agnostic whenever possible.
