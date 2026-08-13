# Angular Development Agent

Antes de alterar `web/**`, leia `.agents/skills/web-frontend-development/SKILL.md` e `DESIGN.md` quando houver impacto visual.

- Preserve as camadas `domain → infra → views`.
- Use Angular standalone, signals, `inject()`, `input()`/`output()` e `ChangeDetectionStrategy.OnPush`.
- Use control flow nativo e formulários reativos; evite `ngClass`, `ngStyle` e lógica complexa em templates.
- Componentes não acessam HTTP ou repositories diretamente; use services e facades.
- Carregue features por lazy loading e mantenha acessibilidade WCAG AA.
- Use nomes de código em inglês; só o texto exibido ao usuário (label, placeholder, botão, toast, validação) é em português do Brasil.
- Nomes sempre no singular: páginas, rotas, services, views, componentes (`transaction.service.ts`, não `transactions.service.ts`).
- Sem comentários no código (exceto código de lib compartilhável); use `index.ts` para reexportar repositories/schemas/services/facades; extraia funções reutilizáveis para `core/utils`/`core/helpers`; tipos fixos viram `enum` prefixado `tp` — ver seção 8 do `architecture/SKILL.md`.
- Execute lint e build antes de concluir.
