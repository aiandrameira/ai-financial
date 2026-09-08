import { Signal, signal, WritableSignal } from "@angular/core";

export interface CursorPageNavSource {
    readonly pageIndex: Signal<number>;
    next(): void;
    previous(): void;
    changeLimit(limit: number): void;
}

export interface CursorPageNav {
    onPageChange(page: number): void;
    onPageSizeChange(limit: number): void;
}

/** Shared prev/next/page-size wiring repeated across every cursor-paginated table. */
export function createCursorPageNav(source: CursorPageNavSource): CursorPageNav {
    return {
        onPageChange: page => {
            if (page > source.pageIndex()) source.next();
            else if (page < source.pageIndex()) source.previous();
        },
        onPageSizeChange: limit => source.changeLimit(limit),
    };
}

export interface CursorSearchSource extends CursorPageNavSource {
    search(query: string): void;
}

export interface CursorSearchController extends CursorPageNav {
    readonly query: WritableSignal<string>;
    onQueryChange(value: string | number | null): void;
    search(): void;
    clear(): void;
}

/** For tables that filter by a single free-text query applied immediately, on top of `createCursorPageNav`. */
export function createCursorSearchController(source: CursorSearchSource): CursorSearchController {
    const query = signal("");

    return {
        ...createCursorPageNav(source),
        query,
        onQueryChange: value => query.set(value?.toString() ?? ""),
        search: () => source.search(query().trim()),
        clear: () => {
            query.set("");
            source.search("");
        },
    };
}
