import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { CreditCardInvoiceFilter } from "@domain/filters";
import { CreditCardInvoiceFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { CreditCardInvoiceDto, CreditCardInvoiceRepository } from "@domain/repositories";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class CreditCardInvoiceService implements CreditCardInvoiceRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/credit-cards");

    find(creditCardId: string, filter: CreditCardInvoiceFilterDto = {}): Observable<CursorPaginated<CreditCardInvoiceDto>> {
        const params = new CreditCardInvoiceFilter(filter).getFilters().toParams();
        return this.#client.get(`${this.#api}/${creditCardId}/invoices`, { params }).pipe(map(response => mapCursorPaginated<CreditCardInvoiceDto>(response)));
    }

    findAll(creditCardId: string, filter: CreditCardInvoiceFilterDto = {}): Observable<CreditCardInvoiceDto[]> {
        return collectCursorPages(cursor => this.find(creditCardId, { ...filter, limit: 100, cursor, includeTotal: false }));
    }

    get(creditCardId: string, id: string): Observable<CreditCardInvoiceDto> {
        return this.#client.get(`${this.#api}/${creditCardId}/invoices/${id}`).pipe(map(response => mapGet(response)));
    }

    getCurrent(creditCardId: string): Observable<CreditCardInvoiceDto> {
        return this.#client.get(`${this.#api}/${creditCardId}/invoices/current`).pipe(map(response => mapGet(response)));
    }

    pay(creditCardId: string, id: string): Observable<void> {
        return this.#client.post<void>(`${this.#api}/${creditCardId}/invoices/${id}/pay`, {});
    }
}
