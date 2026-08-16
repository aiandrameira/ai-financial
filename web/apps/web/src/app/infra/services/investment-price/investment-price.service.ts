import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind, mapGet } from "@core/ui";
import type { InvestmentPriceDto, InvestmentPriceRepository } from "@domain/repositories";
import type { RequestInvestmentPriceDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class InvestmentPriceService implements InvestmentPriceRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/investments");

    find(investmentId: string): Observable<InvestmentPriceDto[]> {
        return this.#client.get(`${this.#api}/${investmentId}/prices`, { params: { page: 1, size: 100 } }).pipe(map(response => mapFind(response)));
    }

    create(investmentId: string, body: RequestInvestmentPriceDto): Observable<InvestmentPriceDto> {
        return this.#client.post(`${this.#api}/${investmentId}/prices`, body).pipe(map(response => mapGet(response)));
    }
}
