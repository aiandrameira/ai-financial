import { Filter } from "./filter.interface";

/**
 * Interface responsável por gerenciar os filtros nas pesquisas
 */
export interface FilterManager {
    buildFilters(): string;
    toParams(): Record<string, string>;
    addFilter<T>(filter: Filter<T>): void;
}
