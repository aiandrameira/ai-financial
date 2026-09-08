import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";

import { CursorPaginationState, DEFAULT_PAGE_SIZE, emptyCursorPage, toLastGoodCursorPage } from "@core/ui";
import { LoanInstallmentDto, LoanInstallmentFilterDto } from "@domain/schemas";
import { LoanInstallmentService } from "@infra/services";

const EMPTY_LIST = emptyCursorPage<LoanInstallmentDto>(DEFAULT_PAGE_SIZE);

@Injectable({ providedIn: "root" })
export class LoanInstallmentFacade extends CursorPaginationState {
    #service = inject(LoanInstallmentService);
    #filter = signal<LoanInstallmentFilterDto>({});
    #scope = signal("");

    #listResource = rxResource({
        params: () => (this.#scope() ? { scope: this.#scope(), filter: { ...this.#filter(), ...this.toQueryParams() } as LoanInstallmentFilterDto } : undefined),
        stream: ({ params }) => this.#service.find(params.scope, params.filter),
        defaultValue: EMPTY_LIST,
    });
    #page = toLastGoodCursorPage(this.#listResource, EMPTY_LIST);
    readonly installments = computed(() => this.#page.list().data);

    constructor() {
        super({ getPagination: () => this.#page.list().pagination, isLoading: () => this.#listResource.isLoading() });
    }

    load(loanId: string, filter?: LoanInstallmentFilterDto): void {
        if (loanId !== this.#scope()) {
            this.#scope.set(loanId);
            this.reset();
        }
        if (filter) this.setFilter(filter);
        this.reload();
    }

    reload(): void {
        this.reset();
        this.#listResource.reload();
    }

    setFilter(filter: LoanInstallmentFilterDto): void {
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

    pay(loanId: string, id: string): Observable<void> {
        return this.#service.pay(loanId, id).pipe(tap(() => this.reload()));
    }
}
