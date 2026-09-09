import { computed, inject, Injectable } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { FinancialPlanDto, FinancialSettingsDto, RequestFinancialSettingsDto } from "@domain/schemas";
import { FinancialPlanService, FinancialSettingsService } from "@infra/services";
import { Observable, tap } from "rxjs";

const EMPTY_PLAN: FinancialPlanDto = { monthlyIncome: "0.00", fixedExpenses: "0.00", surplus: "0.00", debts: [], goals: [] };
const EMPTY_SETTINGS: FinancialSettingsDto = { userId: "", monthlyIncome: "0.00", updatedAt: "" };

@Injectable({ providedIn: "root" })
export class FinancialPlanFacade {
    #settingsService = inject(FinancialSettingsService);
    #planService = inject(FinancialPlanService);

    #settingsResource = rxResource({ stream: () => this.#settingsService.get(), defaultValue: EMPTY_SETTINGS });
    #planResource = rxResource({ stream: () => this.#planService.get(), defaultValue: EMPTY_PLAN });

    readonly settings = computed(() => this.#settingsResource.value());
    readonly plan = computed(() => this.#planResource.value());
    readonly isLoading = computed(() => this.#settingsResource.isLoading() || this.#planResource.isLoading());

    reload(): void {
        this.#settingsResource.reload();
        this.#planResource.reload();
    }

    updateIncome(input: RequestFinancialSettingsDto): Observable<FinancialSettingsDto> {
        return this.#settingsService.update(input).pipe(tap(() => this.reload()));
    }
}
