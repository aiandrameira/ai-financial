import type { Observable } from "rxjs";

import type { FinancialPlanDto } from "../schemas";

export interface FinancialPlanRepository {
    get(): Observable<FinancialPlanDto>;
}

export type { FinancialPlanDto };
