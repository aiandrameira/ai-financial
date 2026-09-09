---
title: API e tecnologias
description: Visão geral da API, tecnologias, endereços e organização dos módulos.
order: 10
---

# API e tecnologias

A API do AI Financial atende o app Angular. Em desenvolvimento, o endereço padrão é `http://localhost:3006`.

## Tecnologias

| Responsabilidade | Tecnologia |
| --- | --- |
| runtime | Bun |
| linguagem | TypeScript |
| servidor HTTP | Elysia |
| validação | Zod |
| banco | PostgreSQL |
| ORM e migrations | Drizzle ORM e Drizzle Kit |
| e-mail | Resend |
| upload de arquivos | AI Storage (comprovantes, notas fiscais) |
| automações/eventos | AI Flow (aviso de fatura/parcela vencendo) |
| documentação interativa | `@elysia/openapi` |
| documentação narrativa | `@aiandralves/ai-docs` |

## Endereços

| Recurso | URL local |
| --- | --- |
| API | `http://localhost:3006` |
| OpenAPI interativo | `http://localhost:3006/openapi` |
| Documentação | `http://localhost:4003` |

## Organização dos módulos

```text
src/modules/<modulo>/
├── app/
│   ├── dtos/
│   ├── schemas/
│   └── usecases/
├── domain/
│   ├── enums/
│   ├── repositories/
│   └── services/
└── infra/
    ├── controllers/
    ├── mappers/
    ├── repositories/
    └── routes/
```

Módulos disponíveis: `account`, `asset`, `budget`, `category`, `credit-card`, `credit-card-invoice`, `financial-plan`, `financial-settings`, `investment`, `loan`, `savings-goal` e `transaction`.

## Identidade

Não há autenticação ainda (veja [Próximas atualizações](../introduction.md#proximas-atualizacoes)). Toda rota opera sob um usuário fixo, `env.DEV_USER_ID`, mas toda tabela já grava `user_id` desde o primeiro schema — quando a autenticação chegar, não é preciso migrar dados, só passar a resolver o usuário real da sessão em vez do valor fixo.

## Envelope de resposta

Toda resposta segue o mesmo formato, descrito em [Endpoints e respostas](./endpoints/index.md).

## Jobs em segundo plano

Três tarefas rodam por cron, além de poderem ser disparadas manualmente:

| Job | O que faz |
| --- | --- |
| `generate-due-recurrences` | materializa a próxima ocorrência de cada transação recorrente (contas fixas) |
| `notify-due-invoices` | avisa (via AI Flow) faturas de cartão vencendo nos próximos dias |
| `notify-due-installments` | avisa (via AI Flow) parcelas de financiamento vencendo nos próximos dias |

## Próximas páginas

1. [Arquitetura](./architecture.md)
2. [Configuração e instalação](./configuration.md)
3. [Banco de dados](./database.md)
4. [Endpoints e respostas JSON](./endpoints/index.md)
5. [OpenAPI YAML](./openapi.md)
