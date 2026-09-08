import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";

import { CursorPaginationState, DEFAULT_PAGE_SIZE, emptyCursorPage, toLastGoodCursorPage } from "@core/ui";
import type { BudgetDto, BudgetFilterDto, CategoryDto, RequestBudgetDto } from "@domain/schemas";
import { BudgetService, CategoryService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class BudgetFacade extends CursorPaginationState {
    #budgetService = inject(BudgetService);
    #categoryService = inject(CategoryService);

    #referenceMonth = signal("");
    #emptyList = emptyCursorPage<BudgetDto>(DEFAULT_PAGE_SIZE);
    #listResource = rxResource({
        params: () => (this.#referenceMonth() ? ({ ...this.toQueryParams(), referenceMonth: this.#referenceMonth() } as BudgetFilterDto) : undefined),
        stream: ({ params }) => this.#budgetService.find(params),
        defaultValue: this.#emptyList,
    });
    #page = toLastGoodCursorPage(this.#listResource, this.#emptyList);
    #categoriesResource = rxResource({ stream: () => this.#categoryService.findAll(), defaultValue: [] as CategoryDto[] });
    readonly budgets = computed(() => this.#page.list().data);
    readonly categories = computed(() => (this.#categoriesResource.status() === "error" ? [] : this.#categoriesResource.value()));

    constructor() {
        super({ getPagination: () => this.#page.list().pagination, isLoading: () => this.#listResource.isLoading() });
    }

    load(referenceMonth: string): void {
        this.#referenceMonth.set(referenceMonth);
        this.reset();
        this.#listResource.reload();
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

    create(input: RequestBudgetDto): Observable<BudgetDto> {
        return this.#budgetService.create(input).pipe(tap(() => this.load(input.referenceMonth)));
    }

    update(id: string, input: RequestBudgetDto): Observable<void> {
        return this.#budgetService.update(id, input).pipe(tap(() => this.load(input.referenceMonth)));
    }

    save(input: RequestBudgetDto): Observable<unknown> {
        if (input.id) {
            return this.update(input.id, input);
        }
        return this.create(input);
    }

    delete(id: string, referenceMonth: string): Observable<void> {
        return this.#budgetService.delete(id).pipe(tap(() => this.load(referenceMonth)));
    }
}
