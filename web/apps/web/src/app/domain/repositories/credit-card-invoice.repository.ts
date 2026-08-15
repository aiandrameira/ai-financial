import type { Observable } from "rxjs";

import type { CreditCardInvoiceDto } from "../schemas";

export interface CreditCardInvoiceRepository {
    find(creditCardId: string): Observable<CreditCardInvoiceDto[]>;
    get(creditCardId: string, id: string): Observable<CreditCardInvoiceDto>;
    getCurrent(creditCardId: string): Observable<CreditCardInvoiceDto>;
    pay(creditCardId: string, id: string): Observable<void>;
}

export type { CreditCardInvoiceDto };
