import { CursorPagination } from "../api-response";

export type SortDirection = "asc" | "desc";

export interface CursorSortConfig<TSort extends string> {
    sortBy: TSort;
    sortDirection?: SortDirection;
}

export interface CursorPaginationConfig<TSort extends string> {
    pageSize?: number;
    sort?: CursorSortConfig<TSort>;
    getPagination: () => CursorPagination;
    isLoading: () => boolean;
}
