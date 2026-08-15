import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { CreditCardDto } from "@domain/repositories";
import type { RequestCreditCardDto } from "@domain/schemas";
import { CreditCardService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class CreditCardFacade {
    #service = inject(CreditCardService);

    #creditCards = signal<CreditCardDto[]>([]);
    creditCards = this.#creditCards.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(): Promise<void> {
        this.#loading.set(true);
        try {
            const creditCards = await firstValueFrom(this.#service.find());
            this.#creditCards.set(creditCards);
        } finally {
            this.#loading.set(false);
        }
    }

    async create(input: RequestCreditCardDto): Promise<void> {
        await firstValueFrom(this.#service.create(input));
        await this.load();
    }

    async update(id: string, input: RequestCreditCardDto): Promise<void> {
        await firstValueFrom(this.#service.update(id, input));
        await this.load();
    }

    async save(input: RequestCreditCardDto): Promise<void> {
        if (input.id) {
            await this.update(input.id, input);
        } else {
            await this.create(input);
        }
    }

    async archive(id: string): Promise<void> {
        await firstValueFrom(this.#service.archive(id));
        await this.load();
    }
}
