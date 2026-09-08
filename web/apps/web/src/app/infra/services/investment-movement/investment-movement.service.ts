import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { InvestmentMovementFilter } from "@domain/filters";
import { InvestmentMovementFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { InvestmentMovementDto, InvestmentMovementRepository } from "@domain/repositories";
import type { RequestInvestmentMovementDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class InvestmentMovementService implements InvestmentMovementRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/investments");

    find(investmentId: string, filter: InvestmentMovementFilterDto = {}): Observable<CursorPaginated<InvestmentMovementDto>> {
        const params = new InvestmentMovementFilter(filter).getFilters().toParams();
        return this.#client.get(`${this.#api}/${investmentId}/movements`, { params }).pipe(map(response => mapCursorPaginated<InvestmentMovementDto>(response)));
    }

    findAll(investmentId: string, filter: InvestmentMovementFilterDto = {}): Observable<InvestmentMovementDto[]> {
        return collectCursorPages(cursor => this.find(investmentId, { ...filter, limit: 100, cursor, includeTotal: false }));
    }

    create(investmentId: string, body: RequestInvestmentMovementDto): Observable<InvestmentMovementDto> {
        return this.#client.post(`${this.#api}/${investmentId}/movements`, body).pipe(map(response => mapGet(response)));
    }

    delete(investmentId: string, id: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/${investmentId}/movements/${id}`);
    }
}
