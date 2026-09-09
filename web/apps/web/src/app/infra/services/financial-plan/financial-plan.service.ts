import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { mapGet } from "@core/ui";
import type { FinancialPlanRepository } from "@domain/repositories";
import type { FinancialPlanDto } from "@domain/schemas";
import { environment } from "@env/environment";
import type { Observable } from "rxjs";
import { map } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class FinancialPlanService implements FinancialPlanRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/financial-plan");

    get(): Observable<FinancialPlanDto> {
        return this.#client.get(this.#api).pipe(map(response => mapGet<FinancialPlanDto>(response)));
    }
}
