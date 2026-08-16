import type { Observable } from "rxjs";

import type { InvestmentPriceDto, RequestInvestmentPriceDto } from "../schemas";

export interface InvestmentPriceRepository {
    find(investmentId: string): Observable<InvestmentPriceDto[]>;
    create(investmentId: string, input: RequestInvestmentPriceDto): Observable<InvestmentPriceDto>;
}

export type { InvestmentPriceDto };
