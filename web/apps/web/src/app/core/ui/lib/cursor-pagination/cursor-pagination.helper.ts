import { computed, effect, ResourceRef, signal, Signal } from "@angular/core";

import { CursorPaginated } from "../api-response";

export function emptyCursorPage<T>(limit: number): CursorPaginated<T> {
    return { data: [], pagination: { limit, next: null, prev: null } };
}

export interface LastGoodCursorPage<T> {
    readonly list: Signal<CursorPaginated<T>>;
    readonly hasNext: Signal<boolean>;
    readonly hasPrevious: Signal<boolean>;
    readonly total: Signal<number>;
}

export function toLastGoodCursorPage<T>(resource: ResourceRef<CursorPaginated<T>>, emptyValue: CursorPaginated<T>): LastGoodCursorPage<T> {
    const lastGood = signal(emptyValue);
    const list = computed(() => (resource.status() === "resolved" ? resource.value() : lastGood()));

    effect(() => {
        if (resource.status() === "resolved") lastGood.set(resource.value());
    });

    return {
        list,
        hasNext: computed(() => list().pagination.next !== null),
        hasPrevious: computed(() => list().pagination.prev !== null),
        total: computed(() => list().pagination.total ?? 0),
    };
}
