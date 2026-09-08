import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { LoanInstallmentFilter } from "@domain/filters";
import { LoanInstallmentFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import type { LoanInstallmentDto, LoanInstallmentRepository } from "@domain/repositories";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class LoanInstallmentService implements LoanInstallmentRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/loans");

    find(loanId: string, filter: LoanInstallmentFilterDto = {}): Observable<CursorPaginated<LoanInstallmentDto>> {
        const params = new LoanInstallmentFilter(filter).getFilters().toParams();
        return this.#client.get(`${this.#api}/${loanId}/installments`, { params }).pipe(map(response => mapCursorPaginated<LoanInstallmentDto>(response)));
    }

    findAll(loanId: string, filter: LoanInstallmentFilterDto = {}): Observable<LoanInstallmentDto[]> {
        return collectCursorPages(cursor => this.find(loanId, { ...filter, limit: 100, cursor, includeTotal: false }));
    }

    pay(loanId: string, id: string): Observable<void> {
        return this.#client.post<void>(`${this.#api}/${loanId}/installments/${id}/pay`, {});
    }
}
