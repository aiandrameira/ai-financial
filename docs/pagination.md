# Filtros, respostas e paginação

O projeto segue o contrato de paginação por cursor do `ai-auth`. A API mantém o fluxo Route → Controller → Use Case → Repository; o frontend usa Filter → Service → Facade → Table.

## Contrato HTTP

Todas as listagens paginadas recebem `limit` (1 a 100, padrão 20), `cursor` opcional e `includeTotal` (`true` ou `false`, padrão `false`). Os filtros específicos de cada recurso continuam disponíveis. `page` e `size` foram substituídos; clientes externos precisam migrar junto com a API.

```http
GET /transactions?limit=10&includeTotal=true&query=aluguel&accountId=account-id
```

```json
{
  "data": [],
  "pagination": {
    "limit": 10,
    "next": null,
    "prev": null,
    "total": 0
  },
  "meta": {
    "message": "OK",
    "status": 200,
    "type": "success"
  }
}
```

O cliente envia o cursor opaco retornado em `pagination.next` ou `pagination.prev`. `null` indica que não há página nessa direção. `total` só é calculado quando solicitado e considera os filtros e o usuário, sem a condição do cursor.

Os repositories consultam `limit + 1` registros com `cursorWhere` e `cursorOrder`, e montam o resultado com `buildCursorPage`. A ordenação usa o campo do recurso e o `id` como desempate. Transações, movimentações e aportes usam data decrescente; parcelas usam número crescente. Os controllers retornam `ApiResponse.cursorPaginated(result)`. Respostas de item, lista completa, sucesso e erro mantêm seus envelopes próprios.

A busca `query` filtra nomes em contas, categorias, cartões, bens, financiamentos, investimentos e metas; em transações, filtra a descrição. Contas, categorias e cartões também mantêm `sortBy` e `sortDirection`.

## Frontend

- Schemas exportam `<Entity>FilterDto`, `<entity>FilterSchema` e `make<Entity>Filter`.
- Classes `<Entity>Filter` usam `FilterProps` e `FilterManager`, como no `ai-auth`.
- `find` retorna `Observable<CursorPaginated<T>>` usando `mapCursorPaginated`; a paginação não é descartada pelo service.
- Facades estendem `CursorPaginationState`, carregam os services com `rxResource` e usam `toLastGoodCursorPage` para manter a última resposta durante o carregamento.
- Tabelas usam `toAiTablePagination` e `createCursorPageNav` ou `createCursorSearchController`. Orçamentos usam o mesmo estado no componente `AiPagination`, preservando a apresentação em cards.
- Mudanças de filtro e tamanho de página reiniciam o cursor. Atualizações após mutações voltam à primeira página.

Os módulos compartilhados ficam em `core/ui/lib/api-response`, `filter` e `cursor-pagination`. Os helpers da tabela ficam dentro de `cursor-pagination`, como na referência. A propriedade `meta` foi mantida com o nome do contrato HTTP, corrigindo o `mata` encontrado nas interfaces da referência.

Para seletores e detalhes que precisam de uma coleção completa, `findAll` percorre as páginas com `collectCursorPages`. Esta adaptação utiliza as rotas existentes do financeiro; não limita os resultados aos primeiros 100 itens. Uma falha em qualquer página propaga o erro, evitando exibir uma coleção incompleta como completa.

## Validação

```sh
cd api
bun run typecheck
bun test

cd ../web
npm run lint
npm run build
bun test apps/web/src/app/core/ui/lib/cursor-pagination/cursor-pagination.test.ts
```

Os testes cobrem navegação nos dois sentidos, desempate por ID, cursor inválido, limite e total opcional, serialização de filtros, reset da paginação, bloqueio durante carregamento e coleta de múltiplas páginas.
