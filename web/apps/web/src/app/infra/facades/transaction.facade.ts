import { inject, Injectable, signal } from "@angular/core";
import { finalize, forkJoin, Observable, tap } from "rxjs";

import type { AccountDto, CategoryDto, CreditCardDto, TransactionDto } from "@domain/repositories";
import type { RequestTransactionDto, RequestTransferDto } from "@domain/schemas";
import { AccountService, CategoryService, CreditCardService, TransactionService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class TransactionFacade {
    #transactionService = inject(TransactionService);
    #accountService = inject(AccountService);
    #categoryService = inject(CategoryService);
    #creditCardService = inject(CreditCardService);

    #transactions = signal<TransactionDto[]>([]);
    transactions = this.#transactions.asReadonly();

    #accounts = signal<AccountDto[]>([]);
    accounts = this.#accounts.asReadonly();

    #categories = signal<CategoryDto[]>([]);
    categories = this.#categories.asReadonly();

    #creditCards = signal<CreditCardDto[]>([]);
    creditCards = this.#creditCards.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    load(): void {
        this.#loading.set(true);
        forkJoin([this.#transactionService.find(), this.#accountService.find(), this.#categoryService.find(), this.#creditCardService.find()])
            .pipe(finalize(() => this.#loading.set(false)))
            .subscribe(([transactions, accounts, categories, creditCards]) => {
                this.#transactions.set(transactions);
                this.#accounts.set(accounts);
                this.#categories.set(categories);
                this.#creditCards.set(creditCards);
            });
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
