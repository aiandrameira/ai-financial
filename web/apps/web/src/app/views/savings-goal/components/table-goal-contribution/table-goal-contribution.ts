import { AiAlertDialogService, AiBadge, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from "@angular/core";
import { formatUtcDateDayjs } from "@core/helpers";
import { TableImports } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { GoalContributionDto } from "@domain/schemas";
import { GoalContributionService } from "@infra/services";

@Component({
    selector: "ai-table-goal-contribution",
    imports: [TableImports, AiBadge],
    templateUrl: "./table-goal-contribution.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableGoalContribution {
    #service = inject(GoalContributionService);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    #contributions = signal<GoalContributionDto[]>([]);

    readonly goalId = input.required<string>();

    readonly columns = signal<AiTableColumn<GoalContributionDto>[]>([
        { key: "date", label: "Data" },
        { key: "amount", label: "Valor" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<GoalContributionDto>>(() => ({
        columns: this.columns(),
        data: this.#contributions(),
    }));

    constructor() {
        effect(() => {
            const goalId = this.goalId();
            if (goalId) {
                this.load();
            }
        });
    }

    load(): void {
        this.#service.find(this.goalId()).subscribe(contributions => this.#contributions.set(contributions));
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

    private _remove(item: GoalContributionDto): void {
        this.#service.delete(this.goalId(), item.id).subscribe({
            next: () => {
                this.#toast.success({ message: "Aporte apagado com sucesso." });
                this.load();
            },
            error: error => {
                const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível apagar o aporte.") : "Não foi possível apagar o aporte.";
                this.#toast.destructive({ message: "Erro ao apagar aporte", description: message });
            },
        });
    }
}
