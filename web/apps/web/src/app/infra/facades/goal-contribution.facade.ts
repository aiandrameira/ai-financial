import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";

import { CursorPaginationState, DEFAULT_PAGE_SIZE, emptyCursorPage, toLastGoodCursorPage } from "@core/ui";
import { GoalContributionDto, GoalContributionFilterDto, RequestGoalContributionDto } from "@domain/schemas";
import { GoalContributionService } from "@infra/services";

const EMPTY_LIST = emptyCursorPage<GoalContributionDto>(DEFAULT_PAGE_SIZE);

@Injectable({ providedIn: "root" })
export class GoalContributionFacade extends CursorPaginationState {
    #service = inject(GoalContributionService);
    #filter = signal<GoalContributionFilterDto>({});
    #scope = signal("");

    #listResource = rxResource({
        params: () => (this.#scope() ? { scope: this.#scope(), filter: { ...this.#filter(), ...this.toQueryParams() } as GoalContributionFilterDto } : undefined),
        stream: ({ params }) => this.#service.find(params.scope, params.filter),
        defaultValue: EMPTY_LIST,
    });
    #page = toLastGoodCursorPage(this.#listResource, EMPTY_LIST);
    readonly contributions = computed(() => this.#page.list().data);

    constructor() {
        super({ getPagination: () => this.#page.list().pagination, isLoading: () => this.#listResource.isLoading() });
    }

    load(goalId: string, filter?: GoalContributionFilterDto): void {
        if (goalId !== this.#scope()) {
            this.#scope.set(goalId);
            this.reset();
        }
        if (filter) this.setFilter(filter);
        this.reload();
    }

    reload(): void {
        this.reset();
        this.#listResource.reload();
    }

    setFilter(filter: GoalContributionFilterDto): void {
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

    create(goalId: string, body: RequestGoalContributionDto): Observable<GoalContributionDto> {
        return this.#service.create(goalId, body).pipe(tap(() => this.reload()));
    }

    delete(goalId: string, id: string): Observable<void> {
        return this.#service.delete(goalId, id).pipe(tap(() => this.reload()));
    }
}
