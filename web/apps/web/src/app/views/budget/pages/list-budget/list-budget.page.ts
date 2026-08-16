import { AiAlertDialogService, AiButton, AiDialogService, AiIcon, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import dayjs from "dayjs";

import { formatMonthYearDayjs } from "@core/helpers";
import { AiHeading } from "@core/ui";
import { formDialogOptions, removeAlertDialog } from "@core/utils";
import { BudgetDto } from "@domain/schemas";
import { BudgetFacade } from "@infra/facades";

import { CardBudget, DialogBudget } from "../../components";

@Component({
    selector: "ai-list-budget",
    imports: [AiHeading, AiButton, AiIcon, CardBudget],
    templateUrl: "./list-budget.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListBudgetPage implements OnInit {
    #facade = inject(BudgetFacade);
    #dialog = inject(AiDialogService);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    readonly currentMonth = signal<string>(dayjs().startOf("month").format("YYYY-MM-DD"));
    readonly monthLabel = computed(() => formatMonthYearDayjs(this.currentMonth()));
    readonly isCurrentMonth = computed(() => this.currentMonth() === dayjs().startOf("month").format("YYYY-MM-DD"));

    readonly budgets = this.#facade.budgets;
    readonly loading = this.#facade.loading;

    ngOnInit(): void {
        this.load(this.currentMonth());
    }

    load(month: string): void {
        this.#facade.load(month);
    }

    protected category(categoryId: string) {
        return this.#facade.categories().find(category => category.id === categoryId) ?? null;
    }

    protected previousMonth(): void {
        this._changeMonth(-1);
    }

    protected nextMonth(): void {
        this._changeMonth(1);
    }

    protected goToToday(): void {
        const today = dayjs().startOf("month").format("YYYY-MM-DD");
        this.currentMonth.set(today);
        this.load(today);
    }

    protected openCreate(): void {
        this._openDialog(null);
    }

    protected openEdit(budget: BudgetDto): void {
        this._openDialog(budget);
    }

    protected onRemove(budget: BudgetDto): void {
        const category = this.category(budget.categoryId);

        this.#alert.confirm({
            ...removeAlertDialog(category?.name ?? "este orçamento", "Orçamento"),
            onConfirm: () => this._remove(budget),
        });
    }

    private _changeMonth(delta: number): void {
        const next = dayjs(this.currentMonth()).add(delta, "month").format("YYYY-MM-DD");
        this.currentMonth.set(next);
        this.load(next);
    }

    private _openDialog(budget: BudgetDto | null): void {
        const isNew = !budget;

        this.#dialog.create<DialogBudget, { referenceMonth: string; budget: BudgetDto | null }>({
            ...formDialogOptions(isNew ? "Cadastrar orçamento" : "Editar orçamento", "Defina o valor planejado para a categoria neste mês.", "pie-chart"),
            width: "480px",
            component: DialogBudget,
            data: { referenceMonth: this.currentMonth(), budget },
        });
    }

    private _remove(budget: BudgetDto): void {
        this.#facade.delete(budget.id, this.currentMonth()).subscribe({
            next: () => {
                this.#toast.success({ message: "Orçamento apagado com sucesso." });
            },
            error: error => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível apagar o orçamento.") : "Não foi possível apagar o orçamento.";
                this.#toast.destructive({ message: "Erro ao apagar orçamento", description: message });
            },
        });
    }
}
