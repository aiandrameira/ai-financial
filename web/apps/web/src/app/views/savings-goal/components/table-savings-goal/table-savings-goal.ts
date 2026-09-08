import type { AiIconType } from "@aiandralves/ai-ui";
import { AiAlertDialogService, AiBadge, AiIcon, AiInput, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { Router } from "@angular/router";
import { formatUtcDateDayjs } from "@core/helpers";
import { createCursorSearchController, TableImports, toAiTablePagination } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { SavingsGoalDto } from "@domain/schemas";
import { SavingsGoalFacade } from "@infra/facades";

@Component({
    selector: "ai-table-savings-goal",
    imports: [TableImports, AiInput, AiBadge, AiIcon],
    templateUrl: "./table-savings-goal.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSavingsGoal implements OnInit {
    #facade = inject(SavingsGoalFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);
    #router = inject(Router);

    readonly edit = output<SavingsGoalDto>();

    protected iconOf(goal: SavingsGoalDto): AiIconType {
        return (goal.icon ?? "shield-check") as AiIconType;
    }

    protected dateLabel(date: string): string {
        return formatUtcDateDayjs(date);
    }

    readonly paginationConfig = toAiTablePagination(this.#facade, [5, 10, 20, 50]);
    readonly #pageNav = createCursorSearchController(this.#facade);
    readonly query = this.#pageNav.query;
    readonly onQueryChange = this.#pageNav.onQueryChange;
    readonly search = this.#pageNav.search;
    readonly clear = this.#pageNav.clear;
    readonly onPageChange = this.#pageNav.onPageChange;
    readonly onPageSizeChange = this.#pageNav.onPageSizeChange;

    readonly columns = signal<AiTableColumn<SavingsGoalDto>[]>([
        { key: "name", label: "Nome" },
        { key: "targetAmount", label: "Valor-alvo" },
        { key: "progress", label: "Progresso" },
        { key: "targetDate", label: "Prazo" },
        { key: "contributions", label: "Ver aportes" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<SavingsGoalDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.goals(),
    }));

    ngOnInit() {
        this.load();
    }

    load(): void {
        this.#facade.load();
    }

    rowClick(item: SavingsGoalDto) {
        this.edit.emit(item);
    }

    onContributions(event: MouseEvent, item: SavingsGoalDto) {
        event.stopPropagation();
        this.#router.navigate(["/goals", item.id, "contributions"]);
    }

    onRemove(event: MouseEvent, item: SavingsGoalDto) {
        event.stopPropagation();

        this.#alert.confirm({
            ...removeAlertDialog(item.name, "Meta"),
            description: "Tem certeza que deseja apagar esta meta? Todos os aportes vinculados serão apagados.",
            onConfirm: () => this._remove(item),
        });
    }

    private _remove(item: SavingsGoalDto): void {
        this.#facade.delete(item.id).subscribe({
            next: () => {
                this.#toast.success({ message: "Meta apagada com sucesso." });
                this.load();
            },
            error: error => {
                const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível apagar a meta.") : "Não foi possível apagar a meta.";
                this.#toast.destructive({ message: "Erro ao apagar meta", description: message });
            },
        });
    }
}
