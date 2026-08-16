import type { Observable } from "rxjs";

import type { InvestmentMovementDto, RequestInvestmentMovementDto } from "../schemas";

export interface InvestmentMovementRepository {
    find(investmentId: string): Observable<InvestmentMovementDto[]>;
    create(investmentId: string, input: RequestInvestmentMovementDto): Observable<InvestmentMovementDto>;
    delete(investmentId: string, id: string): Observable<void>;
}

export type { InvestmentMovementDto };
