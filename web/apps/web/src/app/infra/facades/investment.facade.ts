import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { InvestmentAssetDto } from "@domain/repositories";
import type { RequestInvestmentAssetDto } from "@domain/schemas";
import { InvestmentService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class InvestmentFacade {
    #service = inject(InvestmentService);

    #assets = signal<InvestmentAssetDto[]>([]);
    assets = this.#assets.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(): Promise<void> {
        this.#loading.set(true);
        try {
            const assets = await firstValueFrom(this.#service.find());
            this.#assets.set(assets);
        } finally {
            this.#loading.set(false);
        }
    }

    async get(id: string): Promise<InvestmentAssetDto> {
        return firstValueFrom(this.#service.get(id));
    }

    async create(input: RequestInvestmentAssetDto): Promise<void> {
        await firstValueFrom(this.#service.create(input));
        await this.load();
    }

    async update(id: string, input: RequestInvestmentAssetDto): Promise<void> {
        await firstValueFrom(this.#service.update(id, input));
        await this.load();
    }

    async save(input: RequestInvestmentAssetDto): Promise<void> {
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
