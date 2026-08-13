import type { Observable } from "rxjs";

import type { TransactionFilterProps } from "../filters";
import type { CreateTransaction, TransactionDto } from "../schemas";

export interface TransactionRepository {
    find(filter?: TransactionFilterProps): Observable<TransactionDto[]>;
    create(input: CreateTransaction): Observable<TransactionDto>;
}

export type { TransactionDto };
