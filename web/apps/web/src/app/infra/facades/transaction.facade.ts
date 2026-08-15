import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

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

    async load(): Promise<void> {
        this.#loading.set(true);
        try {
            const [transactions, accounts, categories, creditCards] = await Promise.all([
                firstValueFrom(this.#transactionService.find()),
                firstValueFrom(this.#accountService.find()),
                firstValueFrom(this.#categoryService.find()),
                firstValueFrom(this.#creditCardService.find()),
            ]);
            this.#transactions.set(transactions);
            this.#accounts.set(accounts);
            this.#categories.set(categories);
            this.#creditCards.set(creditCards);
        } finally {
            this.#loading.set(false);
        }
    }

    async create(input: RequestTransactionDto): Promise<void> {
        await firstValueFrom(this.#transactionService.create(input));
        await this.load();
    }

    async update(id: string, input: RequestTransactionDto): Promise<void> {
        await firstValueFrom(this.#transactionService.update(id, input));
        await this.load();
    }

    async save(input: RequestTransactionDto): Promise<void> {
        if (input.id) {
            await this.update(input.id, input);
        } else {
            await this.create(input);
        }
    }

    async createTransfer(input: RequestTransferDto): Promise<void> {
        await firstValueFrom(this.#transactionService.createTransfer(input));
        await this.load();
    }

    async delete(id: string): Promise<void> {
        await firstValueFrom(this.#transactionService.delete(id));
        await this.load();
    }

    async deleteTransfer(transferId: string): Promise<void> {
        await firstValueFrom(this.#transactionService.deleteTransfer(transferId));
        await this.load();
    }
}
