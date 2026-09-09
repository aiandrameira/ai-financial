import type { Observable } from "rxjs";

import type { FinancialSettingsDto, RequestFinancialSettingsDto } from "../schemas";

export interface FinancialSettingsRepository {
    get(): Observable<FinancialSettingsDto>;
    update(input: RequestFinancialSettingsDto): Observable<FinancialSettingsDto>;
}

export type { FinancialSettingsDto };
