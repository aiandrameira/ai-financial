import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";

import { CursorPaginationState, DEFAULT_PAGE_SIZE, emptyCursorPage, toLastGoodCursorPage } from "@core/ui";
import { CreditCardInvoiceDto, CreditCardInvoiceFilterDto, TransactionDto } from "@domain/schemas";
import { CreditCardInvoiceService, TransactionService } from "@infra/services";

const EMPTY_LIST = emptyCursorPage<CreditCardInvoiceDto>(DEFAULT_PAGE_SIZE);

@Injectable({ providedIn: "root" })
export class CreditCardInvoiceFacade extends CursorPaginationState {
    #service = inject(CreditCardInvoiceService);
    #filter = signal<CreditCardInvoiceFilterDto>({});
    #scope = signal("");

    #listResource = rxResource({
        params: () => (this.#scope() ? { scope: this.#scope(), filter: { ...this.#filter(), ...this.toQueryParams() } as CreditCardInvoiceFilterDto } : undefined),
        stream: ({ params }) => this.#service.find(params.scope, params.filter),
        defaultValue: EMPTY_LIST,
    });
    #page = toLastGoodCursorPage(this.#listResource, EMPTY_LIST);
    readonly invoices = computed(() => this.#page.list().data);

    #transactionService = inject(TransactionService);
    #invoiceId = signal("");
    #transactionResource = rxResource({
        params: () => this.#invoiceId() || undefined,
        stream: ({ params }) => this.#transactionService.findAll({ invoiceId: params }),
        defaultValue: [] as TransactionDto[],
    });
    readonly invoiceTransactions = computed(() => (this.#transactionResource.status() === "error" ? [] : this.#transactionResource.value()));
    readonly loadingTransactions = this.#transactionResource.isLoading;

    constructor() {
        super({ getPagination: () => this.#page.list().pagination, isLoading: () => this.#listResource.isLoading() });
    }

    load(creditCardId: string, filter?: CreditCardInvoiceFilterDto): void {
        if (creditCardId !== this.#scope()) {
            this.#scope.set(creditCardId);
            this.reset();
        }
        if (filter) this.setFilter(filter);
        this.reload();
    }

    reload(): void {
        this.reset();
        this.#listResource.reload();
    }

    setFilter(filter: CreditCardInvoiceFilterDto): void {
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

    get(creditCardId: string, id: string): Observable<CreditCardInvoiceDto> {
        return this.#service.get(creditCardId, id);
    }

    getCurrent(creditCardId: string): Observable<CreditCardInvoiceDto> {
        return this.#service.getCurrent(creditCardId);
    }

    pay(creditCardId: string, id: string): Observable<void> {
        return this.#service.pay(creditCardId, id).pipe(tap(() => this.reload()));
    }

    loadInvoices(creditCardId: string): void {
        this.load(creditCardId);
    }
    loadInvoiceTransactions(invoiceId: string): void {
        this.#invoiceId.set(invoiceId);
        this.#transactionResource.reload();
    }
    payInvoice(creditCardId: string, invoiceId: string): Observable<void> {
        return this.pay(creditCardId, invoiceId);
    }
}
