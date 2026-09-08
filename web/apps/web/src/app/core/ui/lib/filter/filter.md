## Introdução

A classe `FilterProps` é responsável por armazenar as informações dos filtros necessários para as pesquisas, utilizando os props passados para criar os filtros. Ela possui um método `getFilters()` que retorna um objeto do tipo `FilterManager`, contendo os filtros construídos a partir dos props.

### Exemplo de uso

```typescript
import { FilterProps, FilterManager } from "./filter/interface";

// Suponha que temos um tipo de props para os filtros
interface UserFilterProps {
    name: string;
    age: number;
    isActive: boolean;
}

export class UserFilter {
    props: UserFilterProps;

    constructor(props: UserFilterProps) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<UserFilterProps>(this.props).getFilters();
    }
}
```

### Usando com o `HttpClient`

O `FilterManager` retornado por `getFilters()` expõe dois formatos de saída:

- `buildFilters()`: retorna a query string pronta (ex: `?name=John&age=30`), útil quando a URL é montada manualmente;
- `toParams()`: retorna um objeto simples (`Record<string, string>`), pronto para ser passado na opção `params` do `HttpClient`.

Prefira `toParams()` nos serviços Angular, pois evita concatenação manual de URL:

```typescript
find(filter?: UserFilterDto): Observable<CursorPaginated<UserListDto>> {
    const params = new UserFilter(filter ?? {}).getFilters().toParams();
    return this.#client.get(this.#api, { params }).pipe(map(response => mapCursorPaginated<UserListDto>(response)));
}
```
