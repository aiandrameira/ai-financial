import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { SavingsGoalFilterDto } from "../schemas";

import type { RequestSavingsGoalDto, SavingsGoalDto } from "../schemas";

export interface SavingsGoalRepository {
    find(filter?: SavingsGoalFilterDto): Observable<CursorPaginated<SavingsGoalDto>>;
    findAll(filter?: SavingsGoalFilterDto): Observable<SavingsGoalDto[]>;
    create(input: RequestSavingsGoalDto): Observable<SavingsGoalDto>;
    update(id: string, input: RequestSavingsGoalDto): Observable<void>;
    delete(id: string): Observable<void>;
}

export type { SavingsGoalDto };
