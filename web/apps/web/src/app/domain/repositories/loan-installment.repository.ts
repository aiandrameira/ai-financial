import type { Observable } from "rxjs";

import type { LoanInstallmentDto } from "../schemas";

export interface LoanInstallmentRepository {
    find(loanId: string): Observable<LoanInstallmentDto[]>;
    pay(loanId: string, id: string): Observable<void>;
}

export type { LoanInstallmentDto };
