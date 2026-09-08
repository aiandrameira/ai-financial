import { Signal } from "@angular/core";

export interface CursorTablePaginationSource {
    readonly pageIndex: Signal<number>;
    readonly pageSize: Signal<number>;
    readonly total: Signal<number>;
    readonly hasNext: Signal<boolean>;
    readonly hasPrevious: Signal<boolean>;
    readonly loading: Signal<boolean>;
}
