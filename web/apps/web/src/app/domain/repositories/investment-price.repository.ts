import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { InvestmentPriceFilterDto } from "../schemas";

import type { InvestmentPriceDto, RequestInvestmentPriceDto } from "../schemas";

export interface InvestmentPriceRepository {
    find(investmentId: string, filter?: InvestmentPriceFilterDto): Observable<CursorPaginated<InvestmentPriceDto>>;
    findAll(investmentId: string, filter?: InvestmentPriceFilterDto): Observable<InvestmentPriceDto[]>;
    create(investmentId: string, input: RequestInvestmentPriceDto): Observable<InvestmentPriceDto>;
}

export type { InvestmentPriceDto };
