import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";

import { CursorPaginationState, DEFAULT_PAGE_SIZE, emptyCursorPage, toLastGoodCursorPage } from "@core/ui";
import { InvestmentMovementDto, InvestmentMovementFilterDto, RequestInvestmentMovementDto } from "@domain/schemas";
import { InvestmentMovementService } from "@infra/services";

const EMPTY_LIST = emptyCursorPage<InvestmentMovementDto>(DEFAULT_PAGE_SIZE);

@Injectable({ providedIn: "root" })
export class InvestmentMovementFacade extends CursorPaginationState {
    #service = inject(InvestmentMovementService);
    #filter = signal<InvestmentMovementFilterDto>({});
    #scope = signal("");

    #listResource = rxResource({
        params: () => (this.#scope() ? { scope: this.#scope(), filter: { ...this.#filter(), ...this.toQueryParams() } as InvestmentMovementFilterDto } : undefined),
        stream: ({ params }) => this.#service.find(params.scope, params.filter),
        defaultValue: EMPTY_LIST,
    });
    #page = toLastGoodCursorPage(this.#listResource, EMPTY_LIST);
    readonly movements = computed(() => this.#page.list().data);

    constructor() {
        super({ getPagination: () => this.#page.list().pagination, isLoading: () => this.#listResource.isLoading() });
    }

    load(investmentId: string, filter?: InvestmentMovementFilterDto): void {
        if (investmentId !== this.#scope()) {
            this.#scope.set(investmentId);
            this.reset();
        }
        if (filter) this.setFilter(filter);
        this.reload();
    }

    reload(): void {
        this.reset();
        this.#listResource.reload();
    }

    setFilter(filter: InvestmentMovementFilterDto): void {
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

    create(investmentId: string, body: RequestInvestmentMovementDto): Observable<InvestmentMovementDto> {
        return this.#service.create(investmentId, body).pipe(tap(() => this.reload()));
    }

    delete(investmentId: string, id: string): Observable<void> {
        return this.#service.delete(investmentId, id).pipe(tap(() => this.reload()));
    }
}
