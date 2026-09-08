import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { SavingsGoalFilter } from "@domain/filters";
import { SavingsGoalFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
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

    find(filter: SavingsGoalFilterDto = {}): Observable<CursorPaginated<SavingsGoalDto>> {
        const params = new SavingsGoalFilter(filter).getFilters().toParams();
        return this.#client.get(this.#api, { params }).pipe(map(response => mapCursorPaginated<SavingsGoalDto>(response)));
    }

    findAll(filter: SavingsGoalFilterDto = {}): Observable<SavingsGoalDto[]> {
        return collectCursorPages(cursor => this.find({ ...filter, limit: 100, cursor, includeTotal: false }));
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
