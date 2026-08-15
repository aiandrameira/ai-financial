import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { BudgetDto } from "@domain/repositories";
import type { RequestBudgetDto } from "@domain/schemas";
import { BudgetService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class BudgetFacade {
    #service = inject(BudgetService);

    #budgets = signal<BudgetDto[]>([]);
    budgets = this.#budgets.asReadonly();

    #referenceMonth = signal<string>("");
    referenceMonth = this.#referenceMonth.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(referenceMonth: string): Promise<void> {
        this.#referenceMonth.set(referenceMonth);
        this.#loading.set(true);
        try {
            const budgets = await firstValueFrom(this.#service.find(referenceMonth));
            this.#budgets.set(budgets);
        } finally {
            this.#loading.set(false);
        }
    }

    private async _reload(): Promise<void> {
        await this.load(this.#referenceMonth());
    }

    async create(input: RequestBudgetDto): Promise<void> {
        await firstValueFrom(this.#service.create(input));
        await this._reload();
    }

    async update(id: string, input: RequestBudgetDto): Promise<void> {
        await firstValueFrom(this.#service.update(id, input));
        await this._reload();
    }

    async save(input: RequestBudgetDto): Promise<void> {
        if (input.id) {
            await this.update(input.id, input);
        } else {
            await this.create(input);
        }
    }

    async delete(id: string): Promise<void> {
        await firstValueFrom(this.#service.delete(id));
        await this._reload();
    }
}
