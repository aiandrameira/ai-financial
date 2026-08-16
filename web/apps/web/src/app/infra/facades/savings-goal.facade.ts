import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { SavingsGoalDto } from "@domain/repositories";
import type { RequestSavingsGoalDto } from "@domain/schemas";
import { SavingsGoalService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class SavingsGoalFacade {
    #service = inject(SavingsGoalService);

    #goals = signal<SavingsGoalDto[]>([]);
    goals = this.#goals.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(): Promise<void> {
        this.#loading.set(true);
        try {
            const goals = await firstValueFrom(this.#service.find());
            this.#goals.set(goals);
        } finally {
            this.#loading.set(false);
        }
    }

    async create(input: RequestSavingsGoalDto): Promise<void> {
        await firstValueFrom(this.#service.create(input));
        await this.load();
    }

    async update(id: string, input: RequestSavingsGoalDto): Promise<void> {
        await firstValueFrom(this.#service.update(id, input));
        await this.load();
    }

    async save(input: RequestSavingsGoalDto): Promise<void> {
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
