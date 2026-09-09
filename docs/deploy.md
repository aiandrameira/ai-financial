# Guia de Deploy — AI Financial

A API e o web do AI Financial rodam no **mesmo VPS Hostinger** (`179.197.233.198`) que já hospeda `ai-book`, `ai-auth`, `ai-storage`, `ai-blog` e `crescer-contabilidade`, compartilhando o Caddy do repositório **`ai-infra`** como reverse proxy — não sobe um Caddy próprio.

## Estrutura de domínio

- **`apifinancial.aiandralves.com.br`** → a API (Elysia), servida pelo Caddy do `ai-infra`, que faz `reverse_proxy` pro container `ai_financial_api`.
- **`financial.aiandralves.com.br`** → o dashboard web (Angular, build estático servido por Nginx), `reverse_proxy` pro container `ai_financial_web`.

Ambas se conectam ao Caddy do `ai-infra` pela mesma rede Docker externa (`caddy_shared`) usada por todos os outros projetos.

## Pré-requisito único: rede Docker compartilhada

Se qualquer outro projeto já foi deployado neste VPS, a rede já existe — pule esta etapa. Senão:

```bash
docker network create caddy_shared
```

## Deploy

### 1. Atualizar o `ai-infra` (pega o novo bloco do Caddyfile)

```bash
cd ~/ai-infra
git pull
docker compose up -d --force-recreate caddy
```

O `--force-recreate` é necessário mesmo (não só `up -d`): o `Caddyfile` é montado como bind mount de um arquivo único, e o `git pull` substitui o arquivo (unlink + write) em vez de editar em memória, então sem forçar a recriação o container continua enxergando o inode antigo — confirme com `docker exec ai_infra_caddy cat /etc/caddy/Caddyfile`.

### 2. Apontar os subdomínios pro VPS

No painel da Hostinger (hPanel) → **Domínios** → `aiandralves.com.br` → **DNS / Zona DNS**:

| Tipo | Nome           | Aponta para       |
| ---- | -------------- | ----------------- |
| A    | `apifinancial` | `179.197.233.198` |
| A    | `financial`    | `179.197.233.198` |

Confira a propagação (no seu computador, não no VPS):

```bash
nslookup apifinancial.aiandralves.com.br
nslookup financial.aiandralves.com.br
```

### 3. Baixar o projeto no VPS

O repositório é **privado**, então o `git clone` vai pedir usuário/senha. A "senha" precisa ser um **Personal Access Token** com acesso de leitura ao repositório.

```bash
git clone https://github.com/aiandrameira/ai-financial.git
cd ai-financial
```

> **Nunca edite arquivos versionados direto na VPS com `nano`.** Se precisar de um hotfix urgente, edite local, `git commit` + `git push`, e depois `git pull` na VPS.

### 4. Configurar as senhas/segredos

Dois arquivos:

```bash
cp .env.example .env
nano .env
```

Preencha `POSTGRES_PASSWORD` com uma senha forte.

```bash
cp api/.env.example api/.env
nano api/.env
```

Preencha (os comentários no próprio arquivo explicam cada um):

- `FRONT_URLS="https://financial.aiandralves.com.br"`
- `API_PUBLIC_URL="https://apifinancial.aiandralves.com.br"`
- `RESEND_API_KEY` / `DEFAULT_MAIL_FROM` — mesma conta Resend usada pelos outros projetos. Copie do `.env` local de outro projeto (ex.: `ai-auth`).
- `AI_STORAGE_API_URL="https://apistorage.aiandralves.com.br"` / `AI_STORAGE_API_KEY` / `AI_STORAGE_ENVIRONMENT_ID` — use a Application "AI Financial" e o environment **de produção** cadastrados no AI Storage (não os de desenvolvimento local).
- `AI_FLOW_API_URL` / `AI_FLOW_API_KEY` — **deixe em branco por enquanto**: o AI Flow ainda não está deployado na infra compartilhada. Os jobs que dependem disso (`notify-due-invoices`, `notify-due-installments`) avisam no log e não quebram nada quando essas variáveis não estão configuradas.
- `DATABASE_URL` — **deixe em branco**, o Docker preenche sozinho.
- `DEV_USER_ID` — mantenha o mesmo valor do `.env.example` (usuário fixo enquanto a Fase 7/autenticação não existe).

### 5. Subir

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Sobe 3 serviços: Postgres, API e Web (sem Caddy próprio — reveja a seção acima). A primeira vez demora alguns minutos (baixando imagens + construindo os dois builds — o build da API e do web puxam `@aiandralves/ai-ui`/pacotes privados do GitHub Packages, então `NPM_AUTH_TOKEN` precisa estar exportado no shell antes desse comando). Acompanhe:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

A API roda as migrations automaticamente ao subir (`CMD` do `api/Dockerfile`).

### 6. Testar

```
https://apifinancial.aiandralves.com.br/health
https://financial.aiandralves.com.br
```

## Atualizando depois do primeiro deploy

**Mudou código** (API e/ou Web) — precisa reconstruir a imagem correspondente:

```bash
cd ~/ai-financial
git pull
docker compose -f docker-compose.prod.yml up -d --build api web
```

**Só mudou uma variável do `api/.env`** — não precisa rebuildar, mas `restart` não recarrega o arquivo:

```bash
docker compose -f docker-compose.prod.yml up -d api
```

## Problemas comuns

Veja também os guias de deploy do `ai-infra`, `ai-book` e `ai-storage` — a maior parte (certificado SSL, `git pull` com conflito, `.env` não recarregado) é idêntica. Específico dessa configuração:

**`apifinancial...` ou `financial...` dá erro de conexão mesmo com os containers rodando** — confira se `ai_financial_api` e `ai_financial_web` estão na rede `caddy_shared`: `docker network inspect caddy_shared` deve listar os dois junto com `ai_infra_caddy`. Se não aparecerem, rode `docker compose -f docker-compose.prod.yml up -d api web` de novo.

**Build falha em `npm install` / `bun install` com erro 401/403 do GitHub Packages** — `NPM_AUTH_TOKEN` não estava exportado no shell antes do `docker compose ... up -d --build`. Exporte e rode de novo.
