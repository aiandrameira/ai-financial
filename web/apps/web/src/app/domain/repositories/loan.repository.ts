import type { Observable } from "rxjs";

import type { LoanDto, RequestLoanDto } from "../schemas";

export interface LoanRepository {
    find(): Observable<LoanDto[]>;
    create(input: RequestLoanDto): Observable<LoanDto>;
    update(id: string, input: RequestLoanDto): Observable<void>;
    delete(id: string): Observable<void>;
}

export type { LoanDto };
