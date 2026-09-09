---
title: Configuração e instalação
description: Guia completo para preparar banco, API, frontend, e-mail, upload e documentação.
order: 11
---

# Configuração e instalação

Este guia parte de uma máquina limpa e termina com API, app web e documentação executando localmente. Também é possível subir a API via Docker — veja a seção 3.

## Visão geral do ambiente local

| Serviço | Endereço padrão | Finalidade |
| --- | --- | --- |
| API | `http://localhost:3006` | contas, transações, cartões, orçamento, financiamentos, investimentos, metas e planejamento |
| OpenAPI | `http://localhost:3006/openapi` | testar e consultar endpoints |
| App web | `http://localhost:4213` | uso do dia a dia |
| PostgreSQL | `localhost:65433` | persistência |
| Documentação | `http://localhost:4003` | este portal |

## 1. Pré-requisitos

Instale:

- [Git](https://git-scm.com/);
- [Bun](https://bun.sh/) 1.x ou superior;
- [Node.js](https://nodejs.org/) 20 ou superior e npm;
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) com Docker Compose;
- uma conta [Resend](https://resend.com/) para e-mails (opcional até a fase de notificações);
- acesso a uma instância do **AI Storage** se for testar upload de comprovantes/notas fiscais (opcional).

Confirme as ferramentas:

```bash
git --version
bun --version
node --version
npm --version
docker --version
docker compose version
```

## 2. Clonar o projeto

```bash
git clone https://github.com/aiandrameira/ai-financial.git
cd ai-financial
```

O repositório contém dois projetos independentes:

```text
ai-financial/
├── api/                 # Bun, Elysia, Drizzle e documentação
├── web/                 # workspace Nx/Angular com o app
└── docker-compose.yml   # API + Web + Documentação + Postgres (desenvolvimento)
```

## 3. Subir a infraestrutura

### Opção A — stack completa via Docker

Na raiz do repositório, um único `docker-compose.yml` sobe API, app web, documentação e PostgreSQL, sem precisar instalar Bun ou Node:

```bash
cp api/.env.example api/.env   # preencha conforme a seção 4
docker compose up -d --build
```

As migrations rodam automaticamente no boot do container da API. Pule para a seção 8.

### Opção B — só PostgreSQL, resto local

Use esta opção para rodar API e frontend com hot-reload local.

```bash
docker compose up -d postgres
docker compose ps
```

Container criado:

| Container | Imagem | Porta |
| --- | --- | --- |
| `ai_financial_db` | PostgreSQL 17 | `65433:5432` |

As credenciais locais do PostgreSQL estão no Compose:

```text
banco: ai_financial
usuário: docker
senha: docker
host: localhost
porta: 65433
```

Teste o PostgreSQL:

```bash
docker compose exec postgres pg_isready -U docker -d ai_financial
```

::: warning
O volume do PostgreSQL é nomeado; `docker compose down -v` remove os dados. Não use essa configuração como persistência de produção.
:::

## 4. Configurar a API

Ainda na raiz do repositório:

```bash
cd api
cp .env.example .env
```

Variáveis principais:

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `NODE_ENV` | não | `development`, `production` ou `test`; padrão `development` |
| `PORT` | não | porta informativa; padrão `3006` |
| `FRONT_URLS` | não | origens web confiáveis, separadas por vírgula; padrão `http://localhost:4213` |
| `DATABASE_URL` | sim | URL PostgreSQL iniciada por `postgresql://` |
| `API_PUBLIC_URL` | não | URL pública da API, usada em links futuros de e-mail |
| `DEV_USER_ID` | não | usuário fixo enquanto não existe autenticação (Fase 7) |
| `RESEND_API_KEY` / `DEFAULT_MAIL_FROM` | não | envio de e-mail; opcional até a fase de notificações |
| `AI_STORAGE_API_URL` / `AI_STORAGE_API_KEY` / `AI_STORAGE_ENVIRONMENT_ID` | não | upload de comprovantes/notas fiscais via `/uploads` |
| `AI_FLOW_API_URL` / `AI_FLOW_API_KEY` | não | aviso de fatura/parcela vencendo; sem isso os jobs só avisam no log |

## 5. Configurar upload de arquivos (AI Storage)

Opcional — sem essas variáveis, o endpoint `/uploads` simplesmente não funciona; o restante do sistema opera normalmente.

1. Cadastre uma Application "AI Financial" no AI Storage (`POST /applications`, veja a documentação do AI Storage).
2. Crie um Environment do tipo `development` para essa Application.
3. Preencha `AI_STORAGE_API_URL`, `AI_STORAGE_API_KEY` (retornada só uma vez na criação da Application) e `AI_STORAGE_ENVIRONMENT_ID`.

## 6. Instalar e preparar a API

```bash
cd api
bun install
bun run db:migrate
bun run db:seed
```

O seed pode ser executado novamente sem duplicar dados. Ele cria as categorias padrão (receitas e despesas) usadas pelo `DEV_USER_ID`.

### Executar a API

```bash
bun run dev
```

Confirme:

```text
API:     http://localhost:3006
OpenAPI: http://localhost:3006/openapi
```

## 7. Configurar e executar o app web

Abra outro terminal:

```bash
cd ai-financial/web
npm install
npm run dev
```

O script executa o app na porta `4213`. A URL da API fica em `web/apps/web/src/environments/environment.ts` (desenvolvimento) e `environment.production.ts` (build de produção):

```ts
export const environment = {
    production: false,
    apiUrl: "http://localhost:3006",
    version: packageInfo.version,
};
```

Se mudar a porta da API, atualize `apiUrl` aqui e `FRONT_URLS` em `api/.env`.

## 8. Primeiro acesso

1. Abra `http://localhost:4213`.
2. A rota inicial redireciona para **Contas** — cadastre a primeira conta.
3. Lance uma transação e confirme que o saldo muda.

Um guia completo, passo a passo, está em [Começando no AI Financial](../utility/getting-started.md).

## 9. Executar a documentação

```bash
cd api
bun run docs:dev
```

Acesse `http://localhost:4003`. Para gerar o portal estático:

```bash
bun run docs:build
```

A saída é criada em `api/dist/docs`. O arquivo `api/ai-docs.config.ts` já aponta para `./docs` e habilita busca, tema escuro, cópia de código e Mermaid.

## 10. Comandos de manutenção

Execute a partir de `api/`:

| Comando | Quando usar |
| --- | --- |
| `bun run dev` | iniciar API com reload |
| `bun run db:migrate` | aplicar migrations existentes |
| `bun run db:generate` | gerar migration após mudar schemas Drizzle |
| `bun run db:push` | sincronização direta em desenvolvimento, com cautela |
| `bun run db:seed` | criar categorias padrão |
| `bun run studio` | abrir Drizzle Studio |
| `bun run format` | formatar o código da API |
| `bun run docs:dev` | visualizar documentação |
| `bun run docs:build` | gerar documentação estática |

Execute a partir de `web/`:

| Comando | Quando usar |
| --- | --- |
| `npm run dev` | iniciar o app na porta 4213 |
| `npm run build` | gerar build de produção |
| `npm run lint` | executar e corrigir lint configurado |

## 11. Parar o ambiente

Pare API, web e documentação com `Ctrl+C` em seus terminais (ou `docker compose down`, se estiver usando a Opção A). Para parar somente a infraestrutura da Opção B:

```bash
docker compose stop postgres
```

Não use `docker compose down -v` se houver dados que precisam ser preservados; essa opção remove os volumes, incluindo o PostgreSQL.

## Solução de problemas

### A API falha ao iniciar com erro de ambiente

Compare `.env` com `.env.example`. `DATABASE_URL` é validado na inicialização (`src/env.ts`).

### Não conecta ao PostgreSQL

```bash
docker compose ps
docker compose logs postgres
```

Para o Compose deste projeto, use a porta externa `65433`, banco `ai_financial` e credenciais `docker`/`docker`.

### O navegador bloqueia por CORS ou origem não confiável

Inclua a origem exata em `FRONT_URLS`, reinicie a API e confira `apiUrl` do frontend. Não inclua barra final nem caminho.

### Upload de arquivo falha ou retorna erro de configuração

Confira se `AI_STORAGE_API_URL`, `AI_STORAGE_API_KEY` e `AI_STORAGE_ENVIRONMENT_ID` estão preenchidos e correspondem a uma Application/Environment válidos no AI Storage. Sem essas variáveis, `/uploads` não funciona — o restante do app continua normal.

### Os jobs de aviso (fatura/parcela vencendo) não fazem nada

Esperado quando `AI_FLOW_API_URL`/`AI_FLOW_API_KEY` não estão configurados — o job avisa no log ("não configurados — pulando") e não quebra a aplicação.
