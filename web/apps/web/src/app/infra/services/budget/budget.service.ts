import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { BudgetFilter } from "@domain/filters";
import { BudgetFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { BudgetDto, BudgetRepository } from "@domain/repositories";
import type { RequestBudgetDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class BudgetService implements BudgetRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/budgets");

    find(filter: BudgetFilterDto = {}): Observable<CursorPaginated<BudgetDto>> {
        const params = new BudgetFilter(filter).getFilters().toParams();
        return this.#client.get(this.#api, { params }).pipe(map(response => mapCursorPaginated<BudgetDto>(response)));
    }

    findAll(filter: BudgetFilterDto = {}): Observable<BudgetDto[]> {
        return collectCursorPages(cursor => this.find({ ...filter, limit: 100, cursor, includeTotal: false }));
    }

    create(body: RequestBudgetDto): Observable<BudgetDto> {
        return this.#client.post(this.#api, body).pipe(map(response => mapGet(response)));
    }

    update(id: string, body: RequestBudgetDto): Observable<void> {
        return this.#client.put<void>(`${this.#api}/${id}`, { plannedAmount: body.plannedAmount });
    }

    delete(id: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/${id}`);
    }
}
