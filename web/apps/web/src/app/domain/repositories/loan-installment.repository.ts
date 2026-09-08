import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { LoanInstallmentFilterDto } from "../schemas";

import type { LoanInstallmentDto } from "../schemas";

export interface LoanInstallmentRepository {
    find(loanId: string, filter?: LoanInstallmentFilterDto): Observable<CursorPaginated<LoanInstallmentDto>>;
    findAll(loanId: string, filter?: LoanInstallmentFilterDto): Observable<LoanInstallmentDto[]>;
    pay(loanId: string, id: string): Observable<void>;
}

export type { LoanInstallmentDto };
