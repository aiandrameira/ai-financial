import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { AccountDto } from "@domain/repositories";
import type { RequestAccountDto } from "@domain/schemas";
import { AccountService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class AccountFacade {
    #service = inject(AccountService);

    #accounts = signal<AccountDto[]>([]);
    accounts = this.#accounts.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(): Promise<void> {
        this.#loading.set(true);
        try {
            const accounts = await firstValueFrom(this.#service.find());
            this.#accounts.set(accounts);
        } finally {
            this.#loading.set(false);
        }
    }

    async create(input: RequestAccountDto): Promise<void> {
        await firstValueFrom(this.#service.create(input));
        await this.load();
    }

    async update(id: string, input: RequestAccountDto): Promise<void> {
        await firstValueFrom(this.#service.update(id, input));
        await this.load();
    }

    async save(input: RequestAccountDto): Promise<void> {
        if (input.id) {
            await this.update(input.id, input);
        } else {
            await this.create(input);
        }
    }
}
