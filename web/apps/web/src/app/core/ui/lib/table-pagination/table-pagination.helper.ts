import { AiTablePagination } from "@aiandralves/ai-ui";
import { computed, Signal } from "@angular/core";

import { CursorTablePaginationSource } from "./table-pagination.interface";

export function toAiTablePagination(source: CursorTablePaginationSource): Signal<AiTablePagination> {
    return computed(() => ({
        mode: "cursor",
        pageIndex: source.pageIndex(),
        pageSize: source.pageSize(),
        totalItems: source.total(),
        hasPrevious: source.hasPrevious(),
        hasNext: source.hasNext(),
        disabled: source.loading(),
        showInfo: true,
        showPageSize: true,
        showFirstLast: false,
    }));
}
