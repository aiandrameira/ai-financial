import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { InvestmentMovementFilterDto } from "../schemas";

import type { InvestmentMovementDto, RequestInvestmentMovementDto } from "../schemas";

export interface InvestmentMovementRepository {
    find(investmentId: string, filter?: InvestmentMovementFilterDto): Observable<CursorPaginated<InvestmentMovementDto>>;
    findAll(investmentId: string, filter?: InvestmentMovementFilterDto): Observable<InvestmentMovementDto[]>;
    create(investmentId: string, input: RequestInvestmentMovementDto): Observable<InvestmentMovementDto>;
    delete(investmentId: string, id: string): Observable<void>;
}

export type { InvestmentMovementDto };
