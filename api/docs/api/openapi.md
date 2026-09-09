---
title: OpenAPI YAML
description: Como consultar, exportar e interpretar a especificação OpenAPI do AI Financial.
order: 22
---

# OpenAPI YAML

O Elysia gera a especificação a partir das rotas e dos schemas Zod. Por isso, a instância em execução é a fonte mais atualizada — não mantenha uma segunda especificação manual completa no repositório.

## Interface interativa

Execute a API e abra:

```text
http://localhost:3006/openapi
```

## Obter o documento JSON

```bash
curl http://localhost:3006/openapi/json --output openapi.json
```

No PowerShell:

```powershell
Invoke-WebRequest http://localhost:3006/openapi/json -OutFile openapi.json
```

## Converter para YAML

Uma opção é usar `yaml-cli`:

```bash
npx yaml-cli openapi.json > openapi.yaml
```

## Estrutura esperada

```yaml
openapi: 3.0.3
info:
  title: AI Financial
  version: 1.0.0
servers:
  - url: http://localhost:3006
paths:
  /accounts:
    get:
      summary: List accounts
      responses:
        "200":
          description: Cursor-paginated list of accounts
    post:
      summary: Create account
      responses:
        "201":
          description: Account created
  /transactions/recurrences/generate:
    post:
      summary: Generate due recurring transaction occurrences
      responses:
        "200":
          description: Occurrences generated
  /financial-plan:
    get:
      summary: Get the financial plan overview
      responses:
        "200":
          description: Financial plan overview
```

O trecho mostra a organização, não substitui o arquivo exportado da aplicação.

## O que revisar no YAML

| Seção | Conteúdo |
| --- | --- |
| `info` | nome, descrição e versão |
| `servers` | URLs disponíveis |
| `paths` | métodos e rotas |
| `parameters` | path, query e filtros |
| `requestBody` | corpo e campos obrigatórios |
| `responses` | status e schemas retornados |
| `components.schemas` | modelos reutilizados |

## Manter atualizado

Ao criar ou alterar uma rota:

1. atualize o schema Zod da rota;
2. mantenha `detail.summary`, descrição e respostas coerentes;
3. execute a API;
4. confira o endpoint na interface OpenAPI;
5. exporte novamente o JSON/YAML quando for publicar um artefato estático.
