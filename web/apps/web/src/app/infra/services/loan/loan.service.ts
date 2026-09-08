import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { LoanFilter } from "@domain/filters";
import { LoanFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { LoanDto, LoanRepository } from "@domain/repositories";
import type { RequestLoanDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class LoanService implements LoanRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/loans");

    find(filter: LoanFilterDto = {}): Observable<CursorPaginated<LoanDto>> {
        const params = new LoanFilter(filter).getFilters().toParams();
        return this.#client.get(this.#api, { params }).pipe(map(response => mapCursorPaginated<LoanDto>(response)));
    }

    findAll(filter: LoanFilterDto = {}): Observable<LoanDto[]> {
        return collectCursorPages(cursor => this.find({ ...filter, limit: 100, cursor, includeTotal: false }));
    }

    create(body: RequestLoanDto): Observable<LoanDto> {
        return this.#client.post(this.#api, body).pipe(map(response => mapGet(response)));
    }

    update(id: string, body: RequestLoanDto): Observable<void> {
        return this.#client.put<void>(`${this.#api}/${id}`, { name: body.name, type: body.type, accountId: body.accountId });
    }

    delete(id: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/${id}`);
    }
}
