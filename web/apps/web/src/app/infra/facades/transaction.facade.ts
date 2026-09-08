import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";

import { CursorPaginationState, DEFAULT_PAGE_SIZE, emptyCursorPage, toLastGoodCursorPage } from "@core/ui";
import { AccountDto, CategoryDto, CreditCardDto, RequestTransactionDto, RequestTransferDto, TransactionDto, TransactionFilterDto } from "@domain/schemas";
import { AccountService, CategoryService, CreditCardService, TransactionService } from "@infra/services";

const EMPTY_LIST = emptyCursorPage<TransactionDto>(DEFAULT_PAGE_SIZE);

@Injectable({ providedIn: "root" })
export class TransactionFacade extends CursorPaginationState {
    #service = inject(TransactionService);
    #filter = signal<TransactionFilterDto>({});

    #listResource = rxResource({
        params: () => ({ ...this.#filter(), ...this.toQueryParams() }) as TransactionFilterDto,
        stream: ({ params }) => this.#service.find(params),
        defaultValue: EMPTY_LIST,
    });
    #page = toLastGoodCursorPage(this.#listResource, EMPTY_LIST);
    readonly transactions = computed(() => this.#page.list().data);

    #accountsService = inject(AccountService);
    #accountsResource = rxResource({ stream: () => this.#accountsService.findAll(), defaultValue: [] as AccountDto[] });
    readonly accounts = computed(() => (this.#accountsResource.status() === "error" ? [] : this.#accountsResource.value()));

    #categoriesService = inject(CategoryService);
    #categoriesResource = rxResource({ stream: () => this.#categoriesService.findAll(), defaultValue: [] as CategoryDto[] });
    readonly categories = computed(() => (this.#categoriesResource.status() === "error" ? [] : this.#categoriesResource.value()));

    #creditCardsService = inject(CreditCardService);
    #creditCardsResource = rxResource({ stream: () => this.#creditCardsService.findAll(), defaultValue: [] as CreditCardDto[] });
    readonly creditCards = computed(() => (this.#creditCardsResource.status() === "error" ? [] : this.#creditCardsResource.value()));

    constructor() {
        super({ getPagination: () => this.#page.list().pagination, isLoading: () => this.#listResource.isLoading() });
    }

    load(filter?: TransactionFilterDto): void {
        if (filter) this.setFilter(filter);
        this.reload();
        this.#accountsResource.reload();
        this.#categoriesResource.reload();
        this.#creditCardsResource.reload();
    }

    reload(): void {
        this.reset();
        this.#listResource.reload();
    }

    setFilter(filter: TransactionFilterDto): void {
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

    create(body: RequestTransactionDto): Observable<TransactionDto> {
        return this.#service.create(body).pipe(tap(() => this.load()));
    }

    update(id: string, body: RequestTransactionDto): Observable<void> {
        return this.#service.update(id, body).pipe(tap(() => this.load()));
    }

    createTransfer(body: RequestTransferDto): Observable<void> {
        return this.#service.createTransfer(body).pipe(tap(() => this.load()));
    }

    delete(id: string): Observable<void> {
        return this.#service.delete(id).pipe(tap(() => this.load()));
    }

    deleteTransfer(transferId: string): Observable<void> {
        return this.#service.deleteTransfer(transferId).pipe(tap(() => this.load()));
    }

    save(input: RequestTransactionDto): Observable<unknown> {
        return input.id ? this.update(input.id, input) : this.create(input);
    }
}
