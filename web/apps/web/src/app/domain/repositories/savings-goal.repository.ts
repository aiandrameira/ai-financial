import type { Observable } from "rxjs";

import type { RequestSavingsGoalDto, SavingsGoalDto } from "../schemas";

export interface SavingsGoalRepository {
    find(): Observable<SavingsGoalDto[]>;
    create(input: RequestSavingsGoalDto): Observable<SavingsGoalDto>;
    update(id: string, input: RequestSavingsGoalDto): Observable<void>;
    delete(id: string): Observable<void>;
}

export type { SavingsGoalDto };
