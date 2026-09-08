import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { CreditCardFilterDto } from "../schemas";

import type { CreditCardDto, RequestCreditCardDto } from "../schemas";

export interface CreditCardRepository {
    find(filter?: CreditCardFilterDto): Observable<CursorPaginated<CreditCardDto>>;
    findAll(filter?: CreditCardFilterDto): Observable<CreditCardDto[]>;
    create(input: RequestCreditCardDto): Observable<CreditCardDto>;
    update(id: string, input: RequestCreditCardDto): Observable<void>;
    archive(id: string): Observable<void>;
}

export type { CreditCardDto };
