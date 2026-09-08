import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";

import { CursorPaginationState, DEFAULT_PAGE_SIZE, emptyCursorPage, toLastGoodCursorPage } from "@core/ui";
import { InvestmentPriceDto, InvestmentPriceFilterDto, RequestInvestmentPriceDto } from "@domain/schemas";
import { InvestmentPriceService } from "@infra/services";

const EMPTY_LIST = emptyCursorPage<InvestmentPriceDto>(DEFAULT_PAGE_SIZE);

@Injectable({ providedIn: "root" })
export class InvestmentPriceFacade extends CursorPaginationState {
    #service = inject(InvestmentPriceService);
    #filter = signal<InvestmentPriceFilterDto>({});
    #scope = signal("");

    #listResource = rxResource({
        params: () => (this.#scope() ? { scope: this.#scope(), filter: { ...this.#filter(), ...this.toQueryParams() } as InvestmentPriceFilterDto } : undefined),
        stream: ({ params }) => this.#service.find(params.scope, params.filter),
        defaultValue: EMPTY_LIST,
    });
    #page = toLastGoodCursorPage(this.#listResource, EMPTY_LIST);
    readonly prices = computed(() => this.#page.list().data);

    constructor() {
        super({ getPagination: () => this.#page.list().pagination, isLoading: () => this.#listResource.isLoading() });
    }

    load(investmentId: string, filter?: InvestmentPriceFilterDto): void {
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

    setFilter(filter: InvestmentPriceFilterDto): void {
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

    create(investmentId: string, body: RequestInvestmentPriceDto): Observable<InvestmentPriceDto> {
        return this.#service.create(investmentId, body).pipe(tap(() => this.reload()));
    }
}
