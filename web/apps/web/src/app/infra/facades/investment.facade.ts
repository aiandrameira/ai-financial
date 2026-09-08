import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";

import { CursorPaginationState, DEFAULT_PAGE_SIZE, emptyCursorPage, toLastGoodCursorPage } from "@core/ui";
import { InvestmentAssetDto, InvestmentFilterDto, RequestInvestmentAssetDto } from "@domain/schemas";
import { InvestmentService } from "@infra/services";

const EMPTY_LIST = emptyCursorPage<InvestmentAssetDto>(DEFAULT_PAGE_SIZE);

@Injectable({ providedIn: "root" })
export class InvestmentFacade extends CursorPaginationState {
    #service = inject(InvestmentService);
    #filter = signal<InvestmentFilterDto>({});

    #listResource = rxResource({
        params: () => ({ ...this.#filter(), ...this.toQueryParams() }) as InvestmentFilterDto,
        stream: ({ params }) => this.#service.find(params),
        defaultValue: EMPTY_LIST,
    });
    #page = toLastGoodCursorPage(this.#listResource, EMPTY_LIST);
    readonly assets = computed(() => this.#page.list().data);

    constructor() {
        super({ getPagination: () => this.#page.list().pagination, isLoading: () => this.#listResource.isLoading() });
    }

    load(filter?: InvestmentFilterDto): void {
        if (filter) this.setFilter(filter);
        this.reload();
    }

    reload(): void {
        this.reset();
        this.#listResource.reload();
    }

    setFilter(filter: InvestmentFilterDto): void {
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

    get(id: string): Observable<InvestmentAssetDto> {
        return this.#service.get(id).pipe(tap(() => this.reload()));
    }

    create(body: RequestInvestmentAssetDto): Observable<InvestmentAssetDto> {
        return this.#service.create(body).pipe(tap(() => this.reload()));
    }

    update(id: string, body: RequestInvestmentAssetDto): Observable<void> {
        return this.#service.update(id, body).pipe(tap(() => this.reload()));
    }

    delete(id: string): Observable<void> {
        return this.#service.delete(id).pipe(tap(() => this.reload()));
    }
}
