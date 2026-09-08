import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { AccountFilter } from "@domain/filters";
import { AccountFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { AccountDto, AccountRepository } from "@domain/repositories";
import type { RequestAccountDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class AccountService implements AccountRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/accounts");

    find(filter: AccountFilterDto = {}): Observable<CursorPaginated<AccountDto>> {
        const params = new AccountFilter(filter).getFilters().toParams();
        return this.#client.get(this.#api, { params }).pipe(map(response => mapCursorPaginated<AccountDto>(response)));
    }

    findAll(filter: AccountFilterDto = {}): Observable<AccountDto[]> {
        return collectCursorPages(cursor => this.find({ ...filter, limit: 100, cursor, includeTotal: false }));
    }

    create(body: RequestAccountDto): Observable<AccountDto> {
        return this.#client.post(this.#api, body).pipe(map(response => mapGet(response)));
    }

    update(id: string, body: RequestAccountDto): Observable<void> {
        return this.#client.put<void>(`${this.#api}/${id}`, body);
    }

    archive(id: string): Observable<void> {
        return this.#client.post<void>(`${this.#api}/${id}/archive`, {});
    }
}
