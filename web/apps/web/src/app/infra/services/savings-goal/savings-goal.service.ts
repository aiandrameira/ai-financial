import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind, mapGet } from "@core/ui";
import type { SavingsGoalDto, SavingsGoalRepository } from "@domain/repositories";
import type { RequestSavingsGoalDto } from "@domain/schemas";
import { environment } from "@env/environment";

function toBody(body: RequestSavingsGoalDto) {
    return {
        name: body.name,
        targetAmount: body.targetAmount,
        targetDate: body.targetDate || undefined,
        icon: body.icon || undefined,
        linkedAccountId: body.linkedAccountId || undefined,
    };
}

@Injectable({
    providedIn: "root",
})
export class SavingsGoalService implements SavingsGoalRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/goals");

    find(): Observable<SavingsGoalDto[]> {
        return this.#client.get(this.#api, { params: { page: 1, size: 100 } }).pipe(map(response => mapFind(response)));
    }

    create(body: RequestSavingsGoalDto): Observable<SavingsGoalDto> {
        return this.#client.post(this.#api, toBody(body)).pipe(map(response => mapGet(response)));
    }

    update(id: string, body: RequestSavingsGoalDto): Observable<void> {
        return this.#client.put<void>(`${this.#api}/${id}`, toBody(body));
    }

    delete(id: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/${id}`);
    }
}
