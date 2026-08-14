import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind, mapGet } from "@core/ui";
import type { AccountDto, AccountRepository } from "@domain/repositories";
import type { RequestAccountDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class AccountService implements AccountRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/accounts");

    find(): Observable<AccountDto[]> {
        return this.#client.get(this.#api, { params: { page: 1, size: 100 } }).pipe(map(response => mapFind(response)));
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
