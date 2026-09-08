import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { BudgetFilterDto } from "../schemas";

import type { BudgetDto, RequestBudgetDto } from "../schemas";

export interface BudgetRepository {
    find(filter?: BudgetFilterDto): Observable<CursorPaginated<BudgetDto>>;
    findAll(filter?: BudgetFilterDto): Observable<BudgetDto[]>;
    create(input: RequestBudgetDto): Observable<BudgetDto>;
    update(id: string, input: RequestBudgetDto): Observable<void>;
    delete(id: string): Observable<void>;
}

export type { BudgetDto };
