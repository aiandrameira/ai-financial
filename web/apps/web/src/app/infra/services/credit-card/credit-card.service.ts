import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { CreditCardFilter } from "@domain/filters";
import { CreditCardFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { CreditCardDto, CreditCardRepository } from "@domain/repositories";
import type { RequestCreditCardDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class CreditCardService implements CreditCardRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/credit-cards");

    find(filter: CreditCardFilterDto = {}): Observable<CursorPaginated<CreditCardDto>> {
        const params = new CreditCardFilter(filter).getFilters().toParams();
        return this.#client.get(this.#api, { params }).pipe(map(response => mapCursorPaginated<CreditCardDto>(response)));
    }

    findAll(filter: CreditCardFilterDto = {}): Observable<CreditCardDto[]> {
        return collectCursorPages(cursor => this.find({ ...filter, limit: 100, cursor, includeTotal: false }));
    }

    create(body: RequestCreditCardDto): Observable<CreditCardDto> {
        return this.#client.post(this.#api, body).pipe(map(response => mapGet(response)));
    }

    update(id: string, body: RequestCreditCardDto): Observable<void> {
        return this.#client.put<void>(`${this.#api}/${id}`, body);
    }

    archive(id: string): Observable<void> {
        return this.#client.post<void>(`${this.#api}/${id}/archive`, {});
    }
}
