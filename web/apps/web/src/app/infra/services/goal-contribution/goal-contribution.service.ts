import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind, mapGet } from "@core/ui";
import type { GoalContributionDto, GoalContributionRepository } from "@domain/repositories";
import type { RequestGoalContributionDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class GoalContributionService implements GoalContributionRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/goals");

    find(goalId: string): Observable<GoalContributionDto[]> {
        return this.#client.get(`${this.#api}/${goalId}/contributions`, { params: { page: 1, size: 300 } }).pipe(map(response => mapFind(response)));
    }

    create(goalId: string, body: RequestGoalContributionDto): Observable<GoalContributionDto> {
        return this.#client.post(`${this.#api}/${goalId}/contributions`, body).pipe(map(response => mapGet(response)));
    }

    delete(goalId: string, id: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/${goalId}/contributions/${id}`);
    }
}
