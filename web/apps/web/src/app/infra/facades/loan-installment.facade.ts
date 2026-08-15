import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { LoanInstallmentDto } from "@domain/repositories";
import { LoanInstallmentService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class LoanInstallmentFacade {
    #service = inject(LoanInstallmentService);

    #installments = signal<LoanInstallmentDto[]>([]);
    installments = this.#installments.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(loanId: string): Promise<void> {
        this.#loading.set(true);
        try {
            const installments = await firstValueFrom(this.#service.find(loanId));
            this.#installments.set(installments);
        } finally {
            this.#loading.set(false);
        }
    }

    async pay(loanId: string, id: string): Promise<void> {
        await firstValueFrom(this.#service.pay(loanId, id));
        await this.load(loanId);
    }
}
