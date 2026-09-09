import { AiButton, AiDialogService, AiProgressBar } from "@aiandralves/ai-ui";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { FinancialSettingsDto } from "@domain/schemas";
import { FinancialPlanFacade } from "@infra/facades";

import { DialogFinancialSettings } from "../../components";

@Component({
    selector: "ai-financial-plan",
    imports: [AiHeading, AiButton, AiProgressBar, CurrencyPipe, DatePipe],
    templateUrl: "./financial-plan.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPlanPage {
    #facade = inject(FinancialPlanFacade);
    #dialog = inject(AiDialogService);

    readonly plan = this.#facade.plan;
    readonly isLoading = this.#facade.isLoading;

    readonly monthlyIncome = computed(() => Number(this.plan().monthlyIncome));
    readonly fixedExpenses = computed(() => Number(this.plan().fixedExpenses));
    readonly surplus = computed(() => Number(this.plan().surplus));
    readonly debts = computed(() => this.plan().debts);
    readonly goals = computed(() => this.plan().goals);

    protected openIncomeDialog(): void {
        this.#dialog.create<DialogFinancialSettings, { settings: FinancialSettingsDto }>({
            ...formDialogOptions("Renda mensal", "Defina sua renda mensal esperada.", "compass-3"),
            component: DialogFinancialSettings,
            data: { settings: this.#facade.settings() },
        });
    }

    protected goalProgress(percent: number): number {
        return Math.min(100, Math.max(0, percent));
    }
}
