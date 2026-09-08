import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";

import { CursorPaginationState, DEFAULT_PAGE_SIZE, emptyCursorPage, toLastGoodCursorPage } from "@core/ui";
import { AccountDto, CreditCardDto, CreditCardFilterDto, RequestCreditCardDto } from "@domain/schemas";
import { AccountService, CreditCardService } from "@infra/services";

const EMPTY_LIST = emptyCursorPage<CreditCardDto>(DEFAULT_PAGE_SIZE);

@Injectable({ providedIn: "root" })
export class CreditCardFacade extends CursorPaginationState {
    #service = inject(CreditCardService);
    #filter = signal<CreditCardFilterDto>({});

    #listResource = rxResource({
        params: () => ({ ...this.#filter(), ...this.toQueryParams() }) as CreditCardFilterDto,
        stream: ({ params }) => this.#service.find(params),
        defaultValue: EMPTY_LIST,
    });
    #page = toLastGoodCursorPage(this.#listResource, EMPTY_LIST);
    readonly creditCards = computed(() => this.#page.list().data);

    #accountsService = inject(AccountService);
    #accountsResource = rxResource({ stream: () => this.#accountsService.findAll(), defaultValue: [] as AccountDto[] });
    readonly accounts = computed(() => (this.#accountsResource.status() === "error" ? [] : this.#accountsResource.value()));

    constructor() {
        super({ getPagination: () => this.#page.list().pagination, isLoading: () => this.#listResource.isLoading() });
    }

    load(filter?: CreditCardFilterDto): void {
        if (filter) this.setFilter(filter);
        this.reload();
        this.#accountsResource.reload();
    }

    reload(): void {
        this.reset();
        this.#listResource.reload();
    }

    setFilter(filter: CreditCardFilterDto): void {
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

    create(body: RequestCreditCardDto): Observable<CreditCardDto> {
        return this.#service.create(body).pipe(tap(() => this.reload()));
    }

    update(id: string, body: RequestCreditCardDto): Observable<void> {
        return this.#service.update(id, body).pipe(tap(() => this.reload()));
    }

    archive(id: string): Observable<void> {
        return this.#service.archive(id).pipe(tap(() => this.reload()));
    }

    save(input: RequestCreditCardDto): Observable<unknown> {
        return input.id ? this.update(input.id, input) : this.create(input);
    }
}
