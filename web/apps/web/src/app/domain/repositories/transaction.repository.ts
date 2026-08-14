import type { Observable } from "rxjs";

import type { TransactionFilterProps } from "../filters";
import type { RequestTransactionDto, TransactionDto } from "../schemas";

export interface TransactionRepository {
    find(filter?: TransactionFilterProps): Observable<TransactionDto[]>;
    create(input: RequestTransactionDto): Observable<TransactionDto>;
    update(id: string, input: RequestTransactionDto): Observable<void>;
}

export type { TransactionDto };
