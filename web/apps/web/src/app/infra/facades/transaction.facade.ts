import { httpResource } from "@angular/common/http";
import { computed, inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";

import { mapFind } from "@core/ui";
import type { AccountDto, CategoryDto, CreditCardDto, TransactionDto } from "@domain/repositories";
import type { RequestTransactionDto, RequestTransferDto } from "@domain/schemas";
import { environment } from "@env/environment";
import { TransactionService } from "@infra/services";

const TRANSACTIONS_API = environment.apiUrl.concat("/transactions");
const ACCOUNTS_API = environment.apiUrl.concat("/accounts");
const CATEGORIES_API = environment.apiUrl.concat("/categories");
const CREDIT_CARDS_API = environment.apiUrl.concat("/credit-cards");

@Injectable({ providedIn: "root" })
export class TransactionFacade {
    #transactionService = inject(TransactionService);

    #transactionsResource = httpResource(() => ({ url: TRANSACTIONS_API, params: { page: 1, size: 100 } }), {
        parse: response => mapFind<TransactionDto>(response),
        defaultValue: [],
    });

    #accountsResource = httpResource(() => ({ url: ACCOUNTS_API, params: { limit: 100 } }), {
        parse: response => mapFind<AccountDto>(response),
        defaultValue: [],
    });

    #categoriesResource = httpResource(() => ({ url: CATEGORIES_API, params: { limit: 100 } }), {
        parse: response => mapFind<CategoryDto>(response),
        defaultValue: [],
    });

    #creditCardsResource = httpResource(() => ({ url: CREDIT_CARDS_API, params: { limit: 100 } }), {
        parse: response => mapFind<CreditCardDto>(response),
        defaultValue: [],
    });

    readonly transactions = computed(() => (this.#transactionsResource.status() === "error" ? [] : this.#transactionsResource.value()));
    readonly accounts = computed(() => (this.#accountsResource.status() === "error" ? [] : this.#accountsResource.value()));
    readonly categories = computed(() => (this.#categoriesResource.status() === "error" ? [] : this.#categoriesResource.value()));
    readonly creditCards = computed(() => (this.#creditCardsResource.status() === "error" ? [] : this.#creditCardsResource.value()));

    readonly loading = computed(
        () => this.#transactionsResource.isLoading() || this.#accountsResource.isLoading() || this.#categoriesResource.isLoading() || this.#creditCardsResource.isLoading(),
    );

    load(): void {
        this.#transactionsResource.reload();
        this.#accountsResource.reload();
        this.#categoriesResource.reload();
        this.#creditCardsResource.reload();
    }

    create(input: RequestTransactionDto): Observable<TransactionDto> {
        return this.#transactionService.create(input).pipe(tap(() => this.load()));
    }

    update(id: string, input: RequestTransactionDto): Observable<void> {
        return this.#transactionService.update(id, input).pipe(tap(() => this.load()));
    }

    save(input: RequestTransactionDto): Observable<unknown> {
        if (input.id) {
            return this.update(input.id, input);
        }
        return this.create(input);
    }

    createTransfer(input: RequestTransferDto): Observable<void> {
        return this.#transactionService.createTransfer(input).pipe(tap(() => this.load()));
    }

    delete(id: string): Observable<void> {
        return this.#transactionService.delete(id).pipe(tap(() => this.load()));
    }

    deleteTransfer(transferId: string): Observable<void> {
        return this.#transactionService.deleteTransfer(transferId).pipe(tap(() => this.load()));
    }
}
