import { AiBadge, AiButton, AiProgressBar } from "@aiandralves/ai-ui";
import { CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";
import { BadgeCategory } from "@core/ui";
import { BudgetDto, CategoryDto } from "@domain/schemas";

type BudgetStatus = "success" | "warning" | "destructive";

const BAR_CLASS: Record<BudgetStatus, string> = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-rose-500",
};

@Component({
    selector: "ai-card-budget",
    imports: [BadgeCategory, AiBadge, AiButton, AiProgressBar, CurrencyPipe],
    templateUrl: "./card-budget.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardBudget {
    readonly budget = input.required<BudgetDto>();
    readonly category = input<CategoryDto | null>(null);

    readonly edit = output<BudgetDto>();
    readonly remove = output<BudgetDto>();

    protected readonly planned = computed(() => Number(this.budget().plannedAmount));
    protected readonly realized = computed(() => Math.abs(Number(this.budget().realizedAmount)));
    protected readonly percent = computed(() => (this.planned() > 0 ? (this.realized() / this.planned()) * 100 : 0));
    protected readonly progressPercent = computed(() => Math.min(100, this.percent()));

    protected readonly status = computed<BudgetStatus>(() => {
        const percent = this.percent();
        if (percent >= 100) return "destructive";
        if (percent >= 80) return "warning";
        return "success";
    });

    protected readonly barClass = computed(() => BAR_CLASS[this.status()]);

    protected onCardClick(): void {
        this.edit.emit(this.budget());
    }

    protected onRemove(event: MouseEvent): void {
        event.stopPropagation();
        this.remove.emit(this.budget());
    }
}
