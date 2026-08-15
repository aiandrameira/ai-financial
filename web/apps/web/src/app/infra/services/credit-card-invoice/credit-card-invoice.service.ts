import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind, mapGet } from "@core/ui";
import type { CreditCardInvoiceDto, CreditCardInvoiceRepository } from "@domain/repositories";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class CreditCardInvoiceService implements CreditCardInvoiceRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/credit-cards");

    find(creditCardId: string): Observable<CreditCardInvoiceDto[]> {
        return this.#client.get(`${this.#api}/${creditCardId}/invoices`, { params: { page: 1, size: 100 } }).pipe(map(response => mapFind(response)));
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
