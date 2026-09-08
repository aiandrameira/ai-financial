import { AiAlertDialogService, AiBadge, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from "@angular/core";
import { formatUtcDateDayjs } from "@core/helpers";
import { createCursorPageNav, TableImports, toAiTablePagination } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { GoalContributionDto } from "@domain/schemas";
import { GoalContributionFacade } from "@infra/facades";

@Component({
    selector: "ai-table-goal-contribution",
    imports: [TableImports, AiBadge],
    templateUrl: "./table-goal-contribution.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableGoalContribution {
    #facade = inject(GoalContributionFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    readonly goalId = input.required<string>();

    readonly paginationConfig = toAiTablePagination(this.#facade, [5, 10, 20, 50]);
    readonly #pageNav = createCursorPageNav(this.#facade);
    readonly onPageChange = this.#pageNav.onPageChange;
    readonly onPageSizeChange = this.#pageNav.onPageSizeChange;

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
            if (goalId) {
                untracked(() => this.load());
            }
        });
    }

    load(): void {
        this.#facade.load(this.goalId());
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
        this.#facade.delete(this.goalId(), item.id).subscribe({
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
