/**
 * Verifica se há filtros ativos em um objeto de filtro
 * @param filter - Objeto de filtro a ser verificado
 * @returns true se houver pelo menos um filtro ativo (não vazio, não null, não undefined)
 */
export function hasActiveFilters<T extends Record<string, any>>(filter: T | null | undefined): boolean {
    if (!filter) return false;

    return Object.values(filter).some(value => {
        if (value === null || value === undefined || value === "") return false;

        if (Array.isArray(value)) return value.length > 0;

        return true;
    });
}
