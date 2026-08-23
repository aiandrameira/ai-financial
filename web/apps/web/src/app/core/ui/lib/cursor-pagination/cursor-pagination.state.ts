import { signal } from "@angular/core";

import { CursorPagination } from "../api-response";

import { DEFAULT_PAGE_SIZE } from "./cursor-pagination.constant";
import { CursorPaginationConfig, SortDirection } from "./cursor-pagination.interface";

export class CursorPaginationState<TSort extends string = never> {
    #hasSort: boolean;
    #getPagination: () => CursorPagination;
    #isLoading: () => boolean;
    #pageIndex = signal(1);
    #pageSize = signal(DEFAULT_PAGE_SIZE);
    #cursor = signal<string | null>(null);
    #sortBy = signal<TSort | undefined>(undefined);
    #sortDirection = signal<SortDirection>("desc");

    readonly pageIndex = this.#pageIndex.asReadonly();
    readonly pageSize = this.#pageSize.asReadonly();
    readonly sortBy = this.#sortBy.asReadonly();
    readonly sortDirection = this.#sortDirection.asReadonly();

    constructor(config: CursorPaginationConfig<TSort>) {
        this.#getPagination = config.getPagination;
        this.#isLoading = config.isLoading;
        if (config.pageSize) this.#pageSize.set(config.pageSize);

        this.#hasSort = config.sort !== undefined;
        this.#sortBy.set(config.sort?.sortBy);
        this.#sortDirection.set(config.sort?.sortDirection ?? "desc");
    }

    reset(): void {
        this.#pageIndex.set(1);
        this.#cursor.set(null);
    }

    goNext(): void {
        const pagination = this.#getPagination();
        if (!pagination.next || this.#isLoading()) return;

        this.#pageIndex.update(page => page + 1);
        this.#cursor.set(pagination.next);
    }

    goPrevious(): void {
        const pagination = this.#getPagination();
        if (!pagination.prev || this.#isLoading()) return;

        this.#pageIndex.update(page => page - 1);
        this.#cursor.set(pagination.prev);
    }

    setPageSize(size: number): void {
        if (size === this.#pageSize()) return;

        this.#pageSize.set(size);
        this.reset();
    }

    setSort(sortBy: TSort, sortDirection: SortDirection): void {
        if (sortBy === this.#sortBy() && sortDirection === this.#sortDirection()) return;

        this.#sortBy.set(sortBy);
        this.#sortDirection.set(sortDirection);
        this.reset();
    }

    toQueryParams(): Record<string, string | number | boolean> {
        const cursor = this.#cursor();
        const sortBy = this.#sortBy();

        return {
            limit: this.#pageSize(),
            includeTotal: true,
            ...(cursor ? { cursor } : {}),
            ...(this.#hasSort && sortBy ? { sortBy, sortDirection: this.#sortDirection() } : {}),
        };
    }
}
