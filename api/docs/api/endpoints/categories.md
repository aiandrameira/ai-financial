---
title: Categorias
description: Endpoints, parâmetros, bodies e respostas de categorias.
order: 17
---

# Categorias

## 1. Cadastrar categoria

::http-method[POST] `/categories`

### Regras de negócio

- `type` é `income` ou `expense` — uma transação ou orçamento só pode usar uma categoria do mesmo tipo;
- `parentId` opcional cria uma subcategoria; a hierarquia é livre (uma subcategoria pode ter suas próprias subcategorias).

### Corpo da requisição

```json
{ "name": "Alimentação", "type": "expense", "icon": "restaurant", "color": "warning" }
```

## 2. Listar categorias

::http-method[GET] `/categories`

## 3. Obter categoria

::http-method[GET] `/categories/:id`

## 4. Atualizar categoria

::http-method[PUT] `/categories/:id`

## 5. Excluir categoria

::http-method[DELETE] `/categories/:id`

Retorna `409 Conflict` se a categoria tiver subcategorias ou transações vinculadas.
