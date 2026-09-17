import { AiBadge, AiButton, AiDialogService, AiIcon, AiProgressBar } from "@aiandralves/ai-ui";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { AiHeading, StatCard, StatCardVariant } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { FinancialSettingsDto } from "@domain/schemas";
import { FinancialPlanFacade } from "@infra/facades";

import { DialogFinancialSettings } from "../../components";

@Component({
    selector: "ai-financial-plan",
    imports: [AiHeading, AiButton, AiIcon, AiBadge, AiProgressBar, StatCard, CurrencyPipe, DatePipe],
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

    readonly surplusVariant = computed<StatCardVariant>(() => (this.surplus() >= 0 ? "emerald" : "rose"));

    // % da renda já comprometido com contas fixas — dá uma leitura imediata de "quanto sobra de
    // fôlego" que os dois valores brutos (renda x contas fixas) sozinhos não deixam óbvio.
    readonly commitmentPercent = computed(() => {
        const income = this.monthlyIncome();
        if (income <= 0) return 0;
        return Math.min(100, Math.round((this.fixedExpenses() / income) * 100));
    });

    readonly commitmentVariant = computed<StatCardVariant>(() => {
        const percent = this.commitmentPercent();
        if (percent >= 80) return "rose";
        if (percent >= 50) return "amber";
        return "emerald";
    });

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
