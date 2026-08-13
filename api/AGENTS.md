# API Development Agent

Antes de alterar `api/**`, leia `.agents/skills/architecture/SKILL.md`.

- Preserve o fluxo Route → Controller → Use Case → Repository.
- Mantenha domínio e aplicação independentes de Elysia e Drizzle.
- Valide entradas com Zod nas rotas e use erros tipados.
- Retorne respostas pelo `ApiResponse` e documente rotas no OpenAPI.
- Use `import type` para tipos e evite `any`.
- Gere migrations pelos scripts do Drizzle; não edite SQL gerado manualmente. Não commite `src/db/migrations` enquanto a fase ainda estiver em desenvolvimento.
- Sem comentários no código (exceto código de lib compartilhável); use `index.ts` para reexportar dtos/schemas/usecases/repositories; extraia funções reutilizáveis para helpers; tipos fixos viram `enum` prefixado `tp` — ver seção 9a do `architecture/SKILL.md`.
- Código sempre em inglês.
- Execute `bun run typecheck` e `bun test` antes de concluir.
