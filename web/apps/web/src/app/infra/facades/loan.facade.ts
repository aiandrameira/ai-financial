import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { LoanDto } from "@domain/repositories";
import type { RequestLoanDto } from "@domain/schemas";
import { LoanService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class LoanFacade {
    #service = inject(LoanService);

    #loans = signal<LoanDto[]>([]);
    loans = this.#loans.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(): Promise<void> {
        this.#loading.set(true);
        try {
            const loans = await firstValueFrom(this.#service.find());
            this.#loans.set(loans);
        } finally {
            this.#loading.set(false);
        }
    }

    async create(input: RequestLoanDto): Promise<void> {
        await firstValueFrom(this.#service.create(input));
        await this.load();
    }

    async update(id: string, input: RequestLoanDto): Promise<void> {
        await firstValueFrom(this.#service.update(id, input));
        await this.load();
    }

    async save(input: RequestLoanDto): Promise<void> {
        if (input.id) {
            await this.update(input.id, input);
        } else {
            await this.create(input);
        }
    }

    async delete(id: string): Promise<void> {
        await firstValueFrom(this.#service.delete(id));
        await this.load();
    }
}
