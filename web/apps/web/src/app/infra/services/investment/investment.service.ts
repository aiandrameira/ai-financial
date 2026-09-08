import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { InvestmentFilter } from "@domain/filters";
import { InvestmentFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { InvestmentAssetDto, InvestmentRepository } from "@domain/repositories";
import type { RequestInvestmentAssetDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class InvestmentService implements InvestmentRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/investments");

    find(filter: InvestmentFilterDto = {}): Observable<CursorPaginated<InvestmentAssetDto>> {
        const params = new InvestmentFilter(filter).getFilters().toParams();
        return this.#client.get(this.#api, { params }).pipe(map(response => mapCursorPaginated<InvestmentAssetDto>(response)));
    }

    findAll(filter: InvestmentFilterDto = {}): Observable<InvestmentAssetDto[]> {
        return collectCursorPages(cursor => this.find({ ...filter, limit: 100, cursor, includeTotal: false }));
    }

    get(id: string): Observable<InvestmentAssetDto> {
        return this.#client.get(`${this.#api}/${id}`).pipe(map(response => mapGet(response)));
    }

    create(body: RequestInvestmentAssetDto): Observable<InvestmentAssetDto> {
        return this.#client.post(this.#api, body).pipe(map(response => mapGet(response)));
    }

    update(id: string, body: RequestInvestmentAssetDto): Observable<void> {
        return this.#client.put<void>(`${this.#api}/${id}`, { name: body.name, type: body.type, broker: body.broker, ticker: body.ticker });
    }

    delete(id: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/${id}`);
    }
}
