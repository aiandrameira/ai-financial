import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { AccountDto, CategoryDto, TransactionDto } from "@domain/repositories";
import type { RequestTransactionDto } from "@domain/schemas";
import { AccountService, CategoryService, TransactionService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class TransactionFacade {
    #transactionService = inject(TransactionService);
    #accountService = inject(AccountService);
    #categoryService = inject(CategoryService);

    #transactions = signal<TransactionDto[]>([]);
    transactions = this.#transactions.asReadonly();

    #accounts = signal<AccountDto[]>([]);
    accounts = this.#accounts.asReadonly();

    #categories = signal<CategoryDto[]>([]);
    categories = this.#categories.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(): Promise<void> {
        this.#loading.set(true);
        try {
            const [transactions, accounts, categories] = await Promise.all([
                firstValueFrom(this.#transactionService.find()),
                firstValueFrom(this.#accountService.find()),
                firstValueFrom(this.#categoryService.find()),
            ]);
            this.#transactions.set(transactions);
            this.#accounts.set(accounts);
            this.#categories.set(categories);
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
}
