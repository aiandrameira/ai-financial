import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { CreditCardInvoiceDto } from "@domain/repositories";
import { CreditCardInvoiceService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class CreditCardInvoiceFacade {
    #service = inject(CreditCardInvoiceService);

    #invoices = signal<CreditCardInvoiceDto[]>([]);
    invoices = this.#invoices.asReadonly();

    #current = signal<CreditCardInvoiceDto | null>(null);
    current = this.#current.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(creditCardId: string): Promise<void> {
        this.#loading.set(true);
        try {
            const [invoices, current] = await Promise.all([firstValueFrom(this.#service.find(creditCardId)), firstValueFrom(this.#service.getCurrent(creditCardId))]);
            this.#invoices.set(invoices);
            this.#current.set(current);
        } finally {
            this.#loading.set(false);
        }
    }

    async pay(creditCardId: string, id: string): Promise<void> {
        await firstValueFrom(this.#service.pay(creditCardId, id));
        await this.load(creditCardId);
    }
}
