export function buildWithFilters(filter?: { buildFilters(): string }): string {
    if (filter) {
        const filterQuery = filter.buildFilters();
        return `${filterQuery}`;
    }

    return "";
}
