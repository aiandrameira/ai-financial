import type { Observable } from "rxjs";

import type { TransactionFilterProps } from "../filters";
import type { RequestTransactionDto, RequestTransferDto, TransactionDto } from "../schemas";

export interface TransactionRepository {
    find(filter?: TransactionFilterProps): Observable<TransactionDto[]>;
    create(input: RequestTransactionDto): Observable<TransactionDto>;
    update(id: string, input: RequestTransactionDto): Observable<void>;
    createTransfer(input: RequestTransferDto): Observable<void>;
    delete(id: string): Observable<void>;
    deleteTransfer(transferId: string): Observable<void>;
}

export type { TransactionDto };
