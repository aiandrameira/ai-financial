import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind, mapGet } from "@core/ui";
import type { InvestmentAssetDto, InvestmentRepository } from "@domain/repositories";
import type { RequestInvestmentAssetDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class InvestmentService implements InvestmentRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/investments");

    find(): Observable<InvestmentAssetDto[]> {
        return this.#client.get(this.#api, { params: { page: 1, size: 100 } }).pipe(map(response => mapFind(response)));
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
