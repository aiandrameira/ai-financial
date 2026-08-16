import { AiAlertDialogService, AiBadge, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from "@angular/core";
import { formatUtcDateDayjs } from "@core/helpers";
import { TableImports } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { GoalContributionDto } from "@domain/schemas";
import { GoalContributionFacade, SavingsGoalFacade } from "@infra/facades";

@Component({
    selector: "ai-table-goal-contribution",
    imports: [TableImports, AiBadge],
    templateUrl: "./table-goal-contribution.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableGoalContribution {
    #facade = inject(GoalContributionFacade);
    #goalFacade = inject(SavingsGoalFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    readonly goalId = input.required<string>();

    readonly columns = signal<AiTableColumn<GoalContributionDto>[]>([
        { key: "date", label: "Data" },
        { key: "amount", label: "Valor" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<GoalContributionDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.contributions(),
    }));

    constructor() {
        effect(() => {
            const goalId = this.goalId();
            this.#facade.load(goalId);
        });
    }

    protected dateLabel(date: string): string {
        return formatUtcDateDayjs(date);
    }

    onRemove(item: GoalContributionDto) {
        this.#alert.confirm({
            ...removeAlertDialog("este aporte", "Aporte"),
            onConfirm: () => this._remove(item),
        });
    }

    private async _remove(item: GoalContributionDto): Promise<void> {
        try {
            await this.#facade.delete(this.goalId(), item.id);
            await this.#goalFacade.load();
            this.#toast.success({ message: "Aporte apagado com sucesso." });
        } catch (error) {
            const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível apagar o aporte.") : "Não foi possível apagar o aporte.";
            this.#toast.destructive({ message: "Erro ao apagar aporte", description: message });
        }
    }
}
