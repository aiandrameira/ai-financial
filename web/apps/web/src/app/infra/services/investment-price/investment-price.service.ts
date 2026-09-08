import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { InvestmentPriceFilter } from "@domain/filters";
import { InvestmentPriceFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { InvestmentPriceDto, InvestmentPriceRepository } from "@domain/repositories";
import type { RequestInvestmentPriceDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class InvestmentPriceService implements InvestmentPriceRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/investments");

    find(investmentId: string, filter: InvestmentPriceFilterDto = {}): Observable<CursorPaginated<InvestmentPriceDto>> {
        const params = new InvestmentPriceFilter(filter).getFilters().toParams();
        return this.#client.get(`${this.#api}/${investmentId}/prices`, { params }).pipe(map(response => mapCursorPaginated<InvestmentPriceDto>(response)));
    }

    findAll(investmentId: string, filter: InvestmentPriceFilterDto = {}): Observable<InvestmentPriceDto[]> {
        return collectCursorPages(cursor => this.find(investmentId, { ...filter, limit: 100, cursor, includeTotal: false }));
    }

    create(investmentId: string, body: RequestInvestmentPriceDto): Observable<InvestmentPriceDto> {
        return this.#client.post(`${this.#api}/${investmentId}/prices`, body).pipe(map(response => mapGet(response)));
    }
}
