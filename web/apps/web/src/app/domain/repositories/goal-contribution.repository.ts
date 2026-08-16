import type { Observable } from "rxjs";

import type { GoalContributionDto, RequestGoalContributionDto } from "../schemas";

export interface GoalContributionRepository {
    find(goalId: string): Observable<GoalContributionDto[]>;
    create(goalId: string, input: RequestGoalContributionDto): Observable<GoalContributionDto>;
    delete(goalId: string, id: string): Observable<void>;
}

export type { GoalContributionDto };
