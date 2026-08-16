import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { RequestInvestmentPriceDto } from "@domain/schemas";
import { InvestmentPriceService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class InvestmentPriceFacade {
    #service = inject(InvestmentPriceService);

    async create(investmentId: string, input: RequestInvestmentPriceDto): Promise<void> {
        await firstValueFrom(this.#service.create(investmentId, input));
    }
}
