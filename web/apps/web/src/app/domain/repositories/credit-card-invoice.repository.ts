import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { CreditCardInvoiceFilterDto } from "../schemas";

import type { CreditCardInvoiceDto } from "../schemas";

export interface CreditCardInvoiceRepository {
    find(creditCardId: string, filter?: CreditCardInvoiceFilterDto): Observable<CursorPaginated<CreditCardInvoiceDto>>;
    findAll(creditCardId: string, filter?: CreditCardInvoiceFilterDto): Observable<CreditCardInvoiceDto[]>;
    get(creditCardId: string, id: string): Observable<CreditCardInvoiceDto>;
    getCurrent(creditCardId: string): Observable<CreditCardInvoiceDto>;
    pay(creditCardId: string, id: string): Observable<void>;
}

export type { CreditCardInvoiceDto };
