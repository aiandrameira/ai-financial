import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind, mapGet } from "@core/ui";
import { TransactionFilter, type TransactionFilterProps } from "@domain/filters";
import type { TransactionDto, TransactionRepository } from "@domain/repositories";
import type { RequestTransactionDto, RequestTransferDto } from "@domain/schemas";
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

    create(body: RequestTransactionDto): Observable<TransactionDto> {
        const payload = {
            ...body,
            accountId: body.accountId || undefined,
            creditCardId: body.creditCardId || undefined,
            categoryId: body.categoryId || undefined,
            installments: body.installments >= 2 ? body.installments : undefined,
        };
        return this.#client.post(this.#api, payload).pipe(map(response => mapGet(response)));
    }

    update(id: string, body: RequestTransactionDto): Observable<void> {
        const payload = {
            ...body,
            accountId: body.accountId || undefined,
            creditCardId: body.creditCardId || undefined,
            categoryId: body.categoryId || undefined,
            installments: undefined,
        };
        return this.#client.put<void>(`${this.#api}/${id}`, payload);
    }

    createTransfer(body: RequestTransferDto): Observable<void> {
        return this.#client.post<void>(this.#api.concat("/transfer"), body);
    }

    delete(id: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/${id}`);
    }

    deleteTransfer(transferId: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/transfer/${transferId}`);
    }
}
