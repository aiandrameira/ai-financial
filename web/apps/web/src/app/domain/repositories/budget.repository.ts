import type { Observable } from "rxjs";

import type { BudgetDto, RequestBudgetDto } from "../schemas";

export interface BudgetRepository {
    find(referenceMonth: string): Observable<BudgetDto[]>;
    create(input: RequestBudgetDto): Observable<BudgetDto>;
    update(id: string, input: RequestBudgetDto): Observable<void>;
    delete(id: string): Observable<void>;
}

export type { BudgetDto };
