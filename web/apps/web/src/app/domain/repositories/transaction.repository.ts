import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { TransactionFilterDto } from "../schemas";

import type { RequestTransactionDto, RequestTransferDto, TransactionDto } from "../schemas";

export interface TransactionRepository {
    find(filter?: TransactionFilterDto): Observable<CursorPaginated<TransactionDto>>;
    findAll(filter?: TransactionFilterDto): Observable<TransactionDto[]>;
    create(input: RequestTransactionDto): Observable<TransactionDto>;
    update(id: string, input: RequestTransactionDto): Observable<void>;
    createTransfer(input: RequestTransferDto): Observable<void>;
    delete(id: string): Observable<void>;
    deleteTransfer(transferId: string): Observable<void>;
}

export type { TransactionDto };
