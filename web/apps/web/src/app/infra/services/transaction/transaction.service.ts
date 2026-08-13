import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind, mapGet } from "@core/ui";
import { TransactionFilter, type TransactionFilterProps } from "@domain/filters";
import type { TransactionDto, TransactionRepository } from "@domain/repositories";
import type { CreateTransaction } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class TransactionService implements TransactionRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/transactions");

    find(filter: TransactionFilterProps = {}): Observable<TransactionDto[]> {
        const params = new TransactionFilter({ page: 1, size: 100, ...filter }).getFilters().toParams();
        return this.#client.get(this.#api, { params }).pipe(map(response => mapFind(response)));
    }

    create(body: CreateTransaction): Observable<TransactionDto> {
        const payload = { ...body, categoryId: body.categoryId || undefined };
        return this.#client.post(this.#api, payload).pipe(map(response => mapGet(response)));
    }
}
