import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { InvestmentMovementDto } from "@domain/repositories";
import type { RequestInvestmentMovementDto } from "@domain/schemas";
import { InvestmentMovementService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class InvestmentMovementFacade {
    #service = inject(InvestmentMovementService);

    #movements = signal<InvestmentMovementDto[]>([]);
    movements = this.#movements.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(investmentId: string): Promise<void> {
        this.#loading.set(true);
        try {
            const movements = await firstValueFrom(this.#service.find(investmentId));
            this.#movements.set(movements);
        } finally {
            this.#loading.set(false);
        }
    }

    async create(investmentId: string, input: RequestInvestmentMovementDto): Promise<void> {
        await firstValueFrom(this.#service.create(investmentId, input));
        await this.load(investmentId);
    }

    async delete(investmentId: string, id: string): Promise<void> {
        await firstValueFrom(this.#service.delete(investmentId, id));
        await this.load(investmentId);
    }
}
