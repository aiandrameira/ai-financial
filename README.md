# 💰 AI Financial

Gerenciador financeiro pessoal completo: despesas e receitas, cartões de crédito e faturas, financiamentos, investimentos, metas de economia e um dashboard com a visão geral da sua vida financeira.

> 📖 A visão de produto completa (escopo, modelo de dados, roadmap por fases) está em [`docs/planning.md`](./docs/planning.md) — comece por ali para entender o "porquê" antes do "como".

## ✨ Funcionalidades (roadmap)

- **Contas e carteiras** — corrente, poupança, dinheiro
- **Transações** — despesas, receitas, transferências, recorrências, status (previsto/pendente/concluído)
- **Cartões de crédito** — faturas por competência, compras parceladas
- **Orçamento** — planejado vs. realizado por categoria
- **Financiamentos/empréstimos** — parcelas, juros, saldo devedor
- **Investimentos** — carteira de ativos, aportes, histórico de preço
- **Metas de economia** — progresso derivado de aportes reais
- **Bens (patrimônio)** — imóveis, veículos, contrapartida de financiamentos
- **Dashboard** — patrimônio líquido, saldo atual/projetado, fluxo de caixa, próximos vencimentos

Veja o que está em cada fase em [`docs/planning.md`](./docs/planning.md#7-roadmap-por-fases).

## 🏗️ Arquitetura

Dois projetos irmãos, sem workspace Nx compartilhado entre eles:

| Projeto | Stack |
| --- | --- |
| [`api/`](./api) | Bun + Elysia, Drizzle ORM + PostgreSQL, Zod v4, Cloudinary, arquitetura em camadas `domain → app → infra` |
| [`web/`](./web) | Nx + Angular 21 (standalone, signals), `@aiandralves/ai-ui`, Tailwind v4 |

A autenticação é **embutida no próprio projeto**, implementada por último (Fase 7) — sem serviço externo de identidade. Até lá, a API usa um usuário de desenvolvimento fixo (`DEV_USER_ID`). Detalhes em [`docs/planning.md` seção 3](./docs/planning.md#3-autenticação--decisão-e-plano).

## 🚀 Instalação

### Requisitos

- **Bun** `>= 1.x` (compatível com `api/bun.lock`)
- **Node.js** `>= 20` e npm (compatível com `web/package-lock.json`)
- **Docker** e Docker Compose
- Acesso ao **GitHub Packages** para instalar `@aiandralves/ai-ui` e `@aiandralves/ai-docs`
- (Opcional, por enquanto) conta no [Cloudinary](https://cloudinary.com/) — só necessária quando o upload de anexos for usado

### Via Docker (recomendado)

```bash
git clone https://github.com/aiandrameira/ai-financial.git
cd ai-financial

cd api && cp .env.example .env && cd ..
docker compose up -d --build
```

- API: http://localhost:3006
- Documentação (ai-docs): http://localhost:4003
- Web: ainda não disponível via Docker — o app Angular em `web/apps/` será gerado na Fase 1 (veja `docker-compose.yml`, serviço `web` comentado)

### Manual

**API:**

```bash
cd api
cp .env.example .env
bun install
bun run db:migrate   # ainda sem tabelas até a Fase 1
bun run dev
```

**Web:**

```bash
cd web
npm install
npm run dev
```

## 📁 Estrutura de pastas

```text
ai-financial/
├── api/                  # Bun + Elysia — API HTTP
│   ├── src/
│   │   ├── db/           # Drizzle: client, schema, migrations, seed
│   │   ├── http/         # api (response/schema), errors, uploads
│   │   ├── modules/      # módulos de domínio (vazio até a Fase 1)
│   │   └── index.ts      # composição da app Elysia
│   └── docs/              # Markdown servido pelo ai-docs
├── web/                  # Nx + Angular — frontend
│   └── apps/              # apps Angular (vazio até a Fase 1)
├── docs/
│   └── planning.md        # documento vivo de planejamento do produto
└── docker-compose.yml
```

## 🤝 Contribuindo

Veja [`CONTRIBUTING.md`](./CONTRIBUTING.md) para o passo a passo de desenvolvimento, convenções de arquitetura e fluxo de commits.

## 📄 Licença

UNLICENSED — projeto pessoal, uso privado.
