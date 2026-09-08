import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { LoanFilterDto } from "../schemas";

import type { LoanDto, RequestLoanDto } from "../schemas";

export interface LoanRepository {
    find(filter?: LoanFilterDto): Observable<CursorPaginated<LoanDto>>;
    findAll(filter?: LoanFilterDto): Observable<LoanDto[]>;
    create(input: RequestLoanDto): Observable<LoanDto>;
    update(id: string, input: RequestLoanDto): Observable<void>;
    delete(id: string): Observable<void>;
}

export type { LoanDto };
