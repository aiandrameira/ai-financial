---
title: Introdução
description: Visão geral, estrutura, tecnologias e módulos do AI Financial.
order: 2
---

# Introdução

O **AI Financial** é um app de controle financeiro pessoal. Ele reúne contas, transações (com transferências, parcelamento e recorrência), cartões de crédito e faturas, orçamento mensal por categoria, financiamentos com tabela de amortização, investimentos, bens (patrimônio), metas de economia e um painel de planejamento — em uma API Bun/Elysia e uma aplicação web Angular.

O sistema ainda não tem autenticação (isso é uma fase futura — veja [Próximas atualizações](#proximas-atualizacoes)); todo dado é gravado sob um único usuário fixo de desenvolvimento. Isso não afeta o modelo de dados: toda tabela já carrega `user_id` desde o primeiro schema, preparada para autenticação real sem migração de dados.

## Estrutura da documentação

```text
api/docs/
├── index.md
├── introduction.md
├── api/
│   ├── overview.md
│   ├── configuration.md
│   ├── architecture.md
│   ├── database.md
│   ├── endpoints/
│   │   ├── index.md
│   │   ├── accounts.md
│   │   ├── transactions.md
│   │   ├── categories.md
│   │   ├── credit-cards.md
│   │   ├── budgets.md
│   │   ├── loans.md
│   │   ├── investments.md
│   │   ├── savings-goals.md
│   │   ├── assets.md
│   │   └── planning.md
│   └── openapi.md
└── utility/
    ├── overview.md
    ├── getting-started.md
    ├── accounts.md
    ├── transactions.md
    ├── credit-cards.md
    ├── budgets.md
    ├── loans.md
    ├── investments.md
    ├── savings-goals.md
    ├── assets.md
    └── planning.md
```

## Componentes do projeto

| Componente | Responsabilidade |
| --- | --- |
| `api/` | API HTTP, regras de negócio, persistência e esta documentação |
| `web/apps/web/` | Aplicação Angular (o app em si) |
| `@aiandralves/ai-ui` | Componentes visuais compartilhados (design system) |
| `@aiandralves/ai-docs` | Geração deste portal estático |

## Tecnologias

| Área | Tecnologia |
| --- | --- |
| Runtime e API | Bun, TypeScript e Elysia |
| Banco de dados | PostgreSQL e Drizzle ORM |
| Validação | Zod |
| E-mail | Resend |
| Upload de arquivos | AI Storage (comprovantes, notas fiscais) |
| Automações/eventos | AI Flow (aviso de fatura/parcela vencendo) |
| Frontend | Angular, Nx e Signals |
| API interativa | `@elysia/openapi` |
| Portal de documentação | `@aiandralves/ai-docs` |
| Infraestrutura | Docker, Caddy compartilhado (repositório `ai-infra`) |

## Módulos disponíveis

| Área do app | O que permite fazer |
| --- | --- |
| Contas | cadastrar contas (corrente, poupança, carteira) e ver saldo atual/projetado |
| Transações | lançar receitas, despesas e transferências; parcelar no cartão; repetir automaticamente |
| Categorias | classificar transações e orçamentos por tipo (receita/despesa), com subcategorias |
| Cartões de crédito | cadastrar cartões, acompanhar faturas e pagá-las |
| Orçamento | definir um valor planejado por categoria e mês, comparado com o realizado |
| Financiamentos | cadastrar empréstimos/financiamentos com tabela de parcelas (Price) e pagá-las |
| Investimentos | acompanhar ativos, aportes/resgates e preço/cota manual |
| Bens | registrar patrimônio (imóveis, veículos) para compor o patrimônio líquido |
| Metas de economia | definir um valor-alvo e registrar aportes até alcançá-lo |
| Planejamento | definir a renda mensal e ver contas fixas, dívidas e metas num só painel, com a sobra do mês |

## Endereços locais padrão

- API: `http://localhost:3006`
- OpenAPI: `http://localhost:3006/openapi`
- App web: `http://localhost:4213`
- Documentação: `http://localhost:4003`

## Próximos passos

1. Para preparar o ambiente, siga [Configuração e instalação](./api/configuration.md).
2. Para operar o app, abra [Manual de utilização](./utility/overview.md).
3. Para compreender a implementação, consulte [API e tecnologias](./api/overview.md).

## Próximas atualizações

O projeto segue um roadmap por fases (veja `docs/planning.md` no repositório para o detalhe completo). Com contas, transações, cartões, orçamento, financiamentos, investimentos, metas, bens e o painel de planejamento já no ar, o que vem a seguir:

- **Dashboard e relatórios** — patrimônio líquido consolidado, gráfico de fluxo de caixa mensal e orçado × realizado.
- **Autenticação embutida** — login real (substituindo o usuário fixo de desenvolvimento), adaptando padrões do `ai-book`/`better-auth`.
- **Importação de extrato bancário** (CSV/OFX).
- **Open Finance, notificações/alertas e cotação automática de investimentos** (ideias futuras, ainda não desenhadas).
