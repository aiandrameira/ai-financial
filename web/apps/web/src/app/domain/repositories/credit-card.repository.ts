import type { Observable } from "rxjs";

import type { CreditCardDto, RequestCreditCardDto } from "../schemas";

export interface CreditCardRepository {
    find(): Observable<CreditCardDto[]>;
    create(input: RequestCreditCardDto): Observable<CreditCardDto>;
    update(id: string, input: RequestCreditCardDto): Observable<void>;
    archive(id: string): Observable<void>;
}

export type { CreditCardDto };
