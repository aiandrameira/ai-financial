# Angular Development Agent

Antes de alterar `web/**`, leia `.agents/skills/web-frontend-development/SKILL.md` e `DESIGN.md` quando houver impacto visual.

- Preserve as camadas `domain → infra → views`.
- Use Angular standalone, signals, `inject()`, `input()`/`output()` e `ChangeDetectionStrategy.OnPush`.
- Use control flow nativo e formulários reativos; evite `ngClass`, `ngStyle` e lógica complexa em templates.
- Componentes não acessam HTTP ou repositories diretamente; use services e facades.
- Carregue features por lazy loading e mantenha acessibilidade WCAG AA.
- Use nomes de código em inglês e textos/documentação em português do Brasil.
- Execute lint e build antes de concluir.
