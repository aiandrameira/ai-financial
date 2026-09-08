import { EMPTY, expand, map, Observable, reduce } from "rxjs";

import { CursorPaginated } from "../api-response";

export function collectCursorPages<T>(find: (cursor?: string) => Observable<CursorPaginated<T>>): Observable<T[]> {
    return find().pipe(
        expand(page => (page.pagination.next ? find(page.pagination.next) : EMPTY), 1),
        map(page => page.data),
        reduce((items, page) => [...items, ...page], [] as T[]),
    );
}
