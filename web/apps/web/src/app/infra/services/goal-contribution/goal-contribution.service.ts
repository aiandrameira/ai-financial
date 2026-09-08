import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { GoalContributionFilter } from "@domain/filters";
import { GoalContributionFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { GoalContributionDto, GoalContributionRepository } from "@domain/repositories";
import type { RequestGoalContributionDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class GoalContributionService implements GoalContributionRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/goals");

    find(goalId: string, filter: GoalContributionFilterDto = {}): Observable<CursorPaginated<GoalContributionDto>> {
        const params = new GoalContributionFilter(filter).getFilters().toParams();
        return this.#client.get(`${this.#api}/${goalId}/contributions`, { params }).pipe(map(response => mapCursorPaginated<GoalContributionDto>(response)));
    }

    findAll(goalId: string, filter: GoalContributionFilterDto = {}): Observable<GoalContributionDto[]> {
        return collectCursorPages(cursor => this.find(goalId, { ...filter, limit: 100, cursor, includeTotal: false }));
    }

    create(goalId: string, body: RequestGoalContributionDto): Observable<GoalContributionDto> {
        return this.#client.post(`${this.#api}/${goalId}/contributions`, body).pipe(map(response => mapGet(response)));
    }

    delete(goalId: string, id: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/${goalId}/contributions/${id}`);
    }
}
