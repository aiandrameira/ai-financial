import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind, mapGet } from "@core/ui";
import type { InvestmentMovementDto, InvestmentMovementRepository } from "@domain/repositories";
import type { RequestInvestmentMovementDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class InvestmentMovementService implements InvestmentMovementRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/investments");

    find(investmentId: string): Observable<InvestmentMovementDto[]> {
        return this.#client.get(`${this.#api}/${investmentId}/movements`, { params: { page: 1, size: 300 } }).pipe(map(response => mapFind(response)));
    }

    create(investmentId: string, body: RequestInvestmentMovementDto): Observable<InvestmentMovementDto> {
        return this.#client.post(`${this.#api}/${investmentId}/movements`, body).pipe(map(response => mapGet(response)));
    }

    delete(investmentId: string, id: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/${investmentId}/movements/${id}`);
    }
}
