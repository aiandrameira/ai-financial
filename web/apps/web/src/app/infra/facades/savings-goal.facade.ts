import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";

import { CursorPaginationState, DEFAULT_PAGE_SIZE, emptyCursorPage, toLastGoodCursorPage } from "@core/ui";
import { RequestSavingsGoalDto, SavingsGoalDto, SavingsGoalFilterDto } from "@domain/schemas";
import { SavingsGoalService } from "@infra/services";

const EMPTY_LIST = emptyCursorPage<SavingsGoalDto>(DEFAULT_PAGE_SIZE);

@Injectable({ providedIn: "root" })
export class SavingsGoalFacade extends CursorPaginationState {
    #service = inject(SavingsGoalService);
    #filter = signal<SavingsGoalFilterDto>({});

    #listResource = rxResource({
        params: () => ({ ...this.#filter(), ...this.toQueryParams() }) as SavingsGoalFilterDto,
        stream: ({ params }) => this.#service.find(params),
        defaultValue: EMPTY_LIST,
    });
    #page = toLastGoodCursorPage(this.#listResource, EMPTY_LIST);
    readonly goals = computed(() => this.#page.list().data);

    constructor() {
        super({ getPagination: () => this.#page.list().pagination, isLoading: () => this.#listResource.isLoading() });
    }

    load(filter?: SavingsGoalFilterDto): void {
        if (filter) this.setFilter(filter);
        this.reload();
    }

    reload(): void {
        this.reset();
        this.#listResource.reload();
    }

    setFilter(filter: SavingsGoalFilterDto): void {
        this.#filter.set(filter);
        this.reset();
    }

    search(query: string): void {
        this.setFilter({ ...this.#filter(), query });
    }

    changeLimit(limit: number): void {
        this.setPageSize(limit);
    }
    next(): void {
        this.goNext();
    }
    previous(): void {
        this.goPrevious();
    }

    create(body: RequestSavingsGoalDto): Observable<SavingsGoalDto> {
        return this.#service.create(body).pipe(tap(() => this.reload()));
    }

    update(id: string, body: RequestSavingsGoalDto): Observable<void> {
        return this.#service.update(id, body).pipe(tap(() => this.reload()));
    }

    delete(id: string): Observable<void> {
        return this.#service.delete(id).pipe(tap(() => this.reload()));
    }
}
