import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { TransactionFilter } from "@domain/filters";
import { TransactionFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { TransactionDto, TransactionRepository } from "@domain/repositories";
import type { RequestTransactionDto, RequestTransferDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class TransactionService implements TransactionRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/transactions");

    find(filter: TransactionFilterDto = {}): Observable<CursorPaginated<TransactionDto>> {
        const params = new TransactionFilter(filter).getFilters().toParams();
        return this.#client.get(this.#api, { params }).pipe(map(response => mapCursorPaginated<TransactionDto>(response)));
    }

    findAll(filter: TransactionFilterDto = {}): Observable<TransactionDto[]> {
        return collectCursorPages(cursor => this.find({ ...filter, limit: 100, cursor, includeTotal: false }));
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
