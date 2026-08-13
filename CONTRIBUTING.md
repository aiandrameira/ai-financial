# 🤝 Contribuir com o AI Financial

Obrigado por considerar contribuir para o projeto. Queremos tornar este processo o mais fácil possível para você. Esse guia fornecerá todas as informações necessárias para que você possa começar a contribuir.

## 📋 Sumário

- [✅ Requisitos](#-requisitos)
- [🚀 Iniciando](#-iniciando)
- [🏗️ Arquitetura](#-arquitetura)
- [📁 Estrutura de pastas](#-estrutura-de-pastas)
- [🧩 Desenvolvimento no frontend (`web`)](#-desenvolvimento-no-frontend-web)
- [🧱 Desenvolvimento na API (`api`)](#-desenvolvimento-na-api-api)
- [📖 Documentação (ai-docs)](#-documentação-ai-docs)
- [🔐 Autenticação e autorização](#-autenticação-e-autorização)
- [🧪 Testes](#-testes)
- [📝 Linting e formatação](#-linting-e-formatação)
- [🎯 Fluxo de commits](#-fluxo-de-commits)

---

## ✅ Requisitos

- **Bun** `>= 1.x`, compatível com `api/bun.lock`
- **Node.js** `>= 20` e **npm**, compatíveis com `web/package-lock.json`
- **Docker** e Docker Compose (Postgres local, ou a stack inteira via `docker-compose.yml` na raiz)
- Acesso ao **GitHub Packages** para instalar `@aiandralves/ai-ui` e `@aiandralves/ai-docs`
- (Opcional por enquanto) uma conta no [Resend](https://resend.com/) e no [Cloudinary](https://cloudinary.com/) — só necessárias quando notificações e upload de anexos forem implementados

Este projeto **não tem sistema de login ainda**. Autenticação é a Fase 7 do roadmap (embutida, feita por último) — até lá, a API usa um usuário de desenvolvimento fixo (`DEV_USER_ID`, ver `api/.env.example`). Veja [`docs/planning.md` seção 3](./docs/planning.md#3-autenticação--decisão-e-plano).

---

## 🚀 Iniciando

1. Clone o repositório:

```bash
git clone https://github.com/aiandrameira/ai-financial.git
cd ai-financial
```

2. Configure o `.env` da API e suba tudo com Docker (mais rápido, sem precisar instalar Bun/Node):

```bash
cd api && cp .env.example .env
cd ..
docker compose up -d --build
```

Ou rode cada parte manualmente — veja o passo a passo completo em [`README.md` → Instalação](./README.md#-instalação).

3. Acesse:

- API: http://localhost:3006
- Documentação (ai-docs): http://localhost:4003 ← **comece por aqui para entender a arquitetura**
- Web: ainda não disponível — o app Angular em `web/apps/` é gerado na Fase 1 (ver `docs/planning.md`)

---

## 🏗️ Arquitetura

O repositório **não é um único workspace Nx**: são dois projetos irmãos, cada um com sua própria stack.

### `web/` — monorepo Nx (Angular)

- **Nx**: gerenciamento do monorepo, cache de builds
- **Angular 21**: standalone + signals
- **`@aiandralves/ai-ui`**: design system de componentes
- **Tailwind CSS v4**: utilitários de estilo

### `api/` — Bun + Elysia

- **Bun**: runtime e gerenciador de pacotes (`bun.lock`)
- **Elysia**: composição da API a partir de instâncias pequenas (`.use(...)`), nunca um router monolítico
- **Drizzle ORM + PostgreSQL**: persistência, migrations geradas via `drizzle-kit`
- **Zod v4**: validação de request bodies/queries
- **Resend**: envio de e-mails transacionais (a partir da fase de notificações)
- **Cloudinary**: upload de anexos
- **`pdfkit`**: geração de documentos em PDF

### Path aliases

`web/apps/web/tsconfig.json`:

| Alias       | Resolve para                  |
| ----------- | ----------------------------- |
| `@public/*` | `apps/web/public/*`           |
| `@env/*`    | `apps/web/src/environments/*` |
| `@core/*`   | `apps/web/src/app/core/*`     |
| `@domain/*` | `apps/web/src/app/domain/*`   |
| `@infra/*`  | `apps/web/src/app/infra/*`    |
| `@views/*`  | `apps/web/src/app/views/*`    |

`api/tsconfig.json`: `@/*` resolve para `api/src/*`.

### Projetos

| Projeto         | Descrição                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `api/`          | API HTTP: contas, transações, cartões/faturas, orçamento, financiamentos, investimentos, metas, patrimônio, OpenAPI |
| `api/docs/`     | Conteúdo Markdown servido pelo [ai-docs](#-documentação-ai-docs)                                                     |
| `web/apps/web/` | Portal usado para gerenciar as finanças (ainda não gerado — Fase 1)                                                  |

---

## 📁 Estrutura de pastas

```text
ai-financial/
├── api/
│   ├── src/
│   │   ├── db/            # client, schema/ (Drizzle), migrations, seed
│   │   ├── http/
│   │   │   ├── api/       # ApiResponse, paginação
│   │   │   ├── errors/    # AppError e subclasses
│   │   │   └── uploads/   # rota genérica de upload (Cloudinary)
│   │   ├── modules/       # domain → app → infra, um módulo por agregado
│   │   └── index.ts       # composição da app Elysia
│   └── docs/               # markdown consumido pelo ai-docs
├── web/
│   └── apps/                # apps Angular do Nx (vazio até a Fase 1)
├── docs/
│   └── planning.md          # escopo, modelo de dados e roadmap do produto
└── docker-compose.yml
```

---

## 🧩 Desenvolvimento no frontend (`web`)

Siga `web/.agents/skills/architecture/SKILL.md` e `web/.agents/skills/web-frontend-development/SKILL.md` — eles são a fonte da verdade e devem ser lidos antes de qualquer mudança em `src/app`. Consulte também `web/DESIGN.md` para mudanças com impacto visual.

Regras principais:

- Standalone é o padrão no Angular 21 — **nunca** defina `standalone: true`;
- Use `inject()` em vez de injeção via construtor;
- Estado local com **Signals** (`signal()`, `computed()` para estado derivado);
- `ChangeDetectionStrategy.OnPush` em todo componente;
- Use `@if`/`@for`/`@switch` nativos — nunca `*ngIf`/`*ngFor`/`*ngSwitch`;
- Bindings de `class`/`style` em vez de `ngClass`/`ngStyle`;
- Tailwind para estilo; SCSS só quando as utilities não derem conta;
- Reactive Forms, não template-driven.

---

## 🧱 Desenvolvimento na API (`api`)

Siga `api/.agents/skills/architecture/SKILL.md` antes de criar ou modificar qualquer arquivo em `src/modules`, `src/http` ou `src/db`.

Regras principais:

- Fluxo obrigatório: **Route → Controller → Use Case → Repository**;
- `domain/` não importa Elysia nem Drizzle; `app/` depende só de `domain/`; `infra/` é a única camada que toca framework/banco;
- Projeto **single-user, sem workspace/multi-tenant** — não crie um módulo `organization`/`workspace` local. Toda entidade financeira leva `user_id` desde o primeiro schema, mesmo antes da Fase 7 (autenticação); até lá, ele referencia o usuário fixo de desenvolvimento (`env.DEV_USER_ID`). Ver `docs/planning.md` seções 3 e 4.1.1;
- Nunca retorne o tipo de linha/tabela do Drizzle direto de um repositório — mapeie para DTO no `select({...})` do `.drizzle.ts`;
- Respostas sempre pelo envelope `ApiResponse.paginated/list/item/success/error`; erros pelas subclasses de `AppError` (`NotFoundError`, `ConflictError`, `ValidationError`, `UnauthorizedError`);
- Migrations via `bun run db:generate` / `bun run db:migrate` — nunca edite o SQL gerado à mão.

---

## 📖 Documentação (ai-docs)

A documentação funcional e técnica do projeto fica em `api/docs/**/*.md` e é gerada pelo [`@aiandralves/ai-docs`](https://www.npmjs.com/package/@aiandralves/ai-docs) — veja como acessá-la em [`README.md` → Documentação (ai-docs)](./README.md#-documentação-ai-docs).

Sempre que um módulo novo for adicionado, atualize o Markdown correspondente. É o material mais completo do projeto — mostra arquitetura e modelo de dados, não só os endpoints como o `/openapi`.

---

## 🔐 Autenticação e autorização

Não existe ainda. Autenticação é a **Fase 7** do roadmap (`docs/planning.md`), implementada por último, **embutida no próprio `ai-financial`** — sem serviço externo de identidade. Motivo: não travar o desenvolvimento das features financeiras atrás de um fluxo de login.

- Até a Fase 7, a API usa um usuário de desenvolvimento fixo (`env.DEV_USER_ID`) e nenhuma rota exige sessão;
- Quando implementada, a referência de código é o [`ai-book`](https://github.com/aiandrameira/ai-book) (mais completo, já integra Cloudinary para foto de perfil) e o [`better-auth`](https://github.com/aiandrameira/better-auth) — adaptar os padrões desses dois, não reinventar;
- Todo o domínio já é modelado com `user_id` desde a Fase 1 (ver seção "Desenvolvimento na API" acima), então a Fase 7 troca o valor fixo pelo usuário autenticado real, sem migração de schema.

---

## 🧪 Testes

Este projeto **ainda não tem testes automatizados**. Até que essa decisão mude:

- Não crie arquivos `*.spec.ts`/`*.test.ts` nem adicione dependências de teste sem alinhar antes;
- A qualidade é garantida por **lint**, **typecheck** e **build**, rodados localmente.

---

## 📝 Linting e formatação

- **`web/`**: ESLint + Prettier via Nx (`npm run lint`). Rode manualmente antes de commitar mudanças em `web/`.
- **`api/`**: Biome (`bun run format`), sem hook automático — rode manualmente antes de commitar mudanças na API.

> ⚠️ Corrija os erros de lint/typecheck antes de abrir um PR.

---

## 🎯 Fluxo de commits

Usamos **Commits Convencionais** com emojis para feedback visual e histórico legível — é o padrão já usado no histórico deste repositório.

```bash
git add .
git commit -m "✨ feat(api): add accounts routes to the main application"
```

| **Emoji** | **Type**   | **Descrição**                                                       |
| --------- | ---------- | ------------------------------------------------------------------- |
| ✨        | `feat`     | Uma nova funcionalidade                                             |
| 🐛        | `fix`      | Correção de um bug                                                  |
| 🚀        | `perf`     | Melhoria de desempenho                                              |
| ⏪️        | `revert`   | Reverter uma alteração                                              |
| 🏗️        | `build`    | Alterações no sistema de build ou dependências externas             |
| 🔧        | `ci`       | Alterações em arquivos de CI/CD                                     |
| 🚧        | `chore`    | Outras alterações que não se enquadram nas categorias acima         |
| 📚        | `docs`     | Alterações apenas na documentação                                   |
| 📦        | `refactor` | Alteração de código que não corrige bug nem adiciona funcionalidade |
| 💄        | `style`    | Alterações de estilo ou formatação do código                        |
| 🧪        | `test`     | Adicionando testes ausentes ou corrigindo testes existentes         |

Use o escopo entre parênteses para indicar a área afetada (`web`, `api`, `docs`).

**Breaking changes**: adicione `!` após o tipo para indicar uma mudança incompatível:

```bash
git commit -m "✨ feat(api)!: rename transaction response shape"
```

> 💡 **Dica**: rode o lint e o typecheck antes do commit para antecipar erros e evitar retrabalho.
