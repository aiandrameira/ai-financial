import { FilterManager } from "./interface/filter-manage.interface";
import { Filter } from "./interface/filter.interface";

/**
 * Classe responsável por armazenar as informações dos filtros necessários para as pesquisas
 */
export class HttpFilter implements FilterManager {
    private filters: Filter<unknown>[];

    constructor(filters?: Filter<unknown>[]) {
        this.filters = filters || [];
    }

    buildFilters(): string {
        const params = new URLSearchParams();

        this.filters.forEach(filter => {
            if (filter.validate()) {
                params.append(filter.field, String(filter.value));
            }
        });

        const query = params.toString();
        return query ? `?${query}` : "";
    }

    /**
     * Retorna os filtros válidos como um objeto simples, pronto para ser usado diretamente na
     * opção `params` do `HttpClient` (ex: `this.#client.get(url, { params: filter.getFilters().toParams() })`).
     */
    toParams(): Record<string, string> {
        const params: Record<string, string> = {};

        this.filters.forEach(filter => {
            if (filter.validate()) {
                params[filter.field] = String(filter.value);
            }
        });

        return params;
    }

    addFilter<T>(filter: Filter<T>): void {
        this.filters.push(filter);
    }
}
