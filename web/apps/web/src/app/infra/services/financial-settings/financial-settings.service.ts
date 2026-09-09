import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { mapGet } from "@core/ui";
import type { FinancialSettingsRepository } from "@domain/repositories";
import type { FinancialSettingsDto, RequestFinancialSettingsDto } from "@domain/schemas";
import { environment } from "@env/environment";
import type { Observable } from "rxjs";
import { map } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class FinancialSettingsService implements FinancialSettingsRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/financial-settings");

    get(): Observable<FinancialSettingsDto> {
        return this.#client.get(this.#api).pipe(map(response => mapGet<FinancialSettingsDto>(response)));
    }

    update(input: RequestFinancialSettingsDto): Observable<FinancialSettingsDto> {
        return this.#client.put(this.#api, input).pipe(map(response => mapGet<FinancialSettingsDto>(response)));
    }
}
