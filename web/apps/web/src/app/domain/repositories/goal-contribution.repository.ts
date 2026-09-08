import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { GoalContributionFilterDto } from "../schemas";

import type { GoalContributionDto, RequestGoalContributionDto } from "../schemas";

export interface GoalContributionRepository {
    find(goalId: string, filter?: GoalContributionFilterDto): Observable<CursorPaginated<GoalContributionDto>>;
    findAll(goalId: string, filter?: GoalContributionFilterDto): Observable<GoalContributionDto[]>;
    create(goalId: string, input: RequestGoalContributionDto): Observable<GoalContributionDto>;
    delete(goalId: string, id: string): Observable<void>;
}

export type { GoalContributionDto };
