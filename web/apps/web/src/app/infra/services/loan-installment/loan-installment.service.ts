import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind } from "@core/ui";
import type { LoanInstallmentDto, LoanInstallmentRepository } from "@domain/repositories";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class LoanInstallmentService implements LoanInstallmentRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/loans");

    find(loanId: string): Observable<LoanInstallmentDto[]> {
        return this.#client.get(`${this.#api}/${loanId}/installments`, { params: { page: 1, size: 600 } }).pipe(map(response => mapFind(response)));
    }

    pay(loanId: string, id: string): Observable<void> {
        return this.#client.post<void>(`${this.#api}/${loanId}/installments/${id}/pay`, {});
    }
}
