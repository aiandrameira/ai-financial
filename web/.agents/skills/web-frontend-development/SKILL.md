---
name: web-frontend-development
description: Padrões para implementar e revisar o frontend Angular/Nx do AI Financial.
---

# Desenvolvimento do frontend

Antes de editar, leia `web/AGENTS.md`, examine um módulo equivalente e preserve a separação:

```text
domain → infra → views
```

- `domain`: schemas, contratos e regras independentes do Angular.
- `infra`: HTTP, services, stores, facades, guards e configuração.
- `views`: rotas, páginas e componentes de apresentação.

Use Angular 21+, componentes standalone sem declarar `standalone: true`, `inject()`, signals, `computed()`, `input()`/`output()` e `OnPush`. Prefira control flow nativo, formulários reativos, templates simples e APIs públicas por `index.ts`. Componentes não chamam HTTP diretamente.

Arquivos usam `kebab-case`; páginas terminam em `.page.ts` e demais artefatos usam os sufixos `.service.ts`, `.repository.ts`, `.facade.ts`, `.guard.ts`, `.resolver.ts`, `.routes.ts` e `.schema.ts`. Código fica em inglês; interface e documentação, em português do Brasil.

Ao concluir, atualize documentação afetada e execute:

```bash
npm run lint
npm run build
```
