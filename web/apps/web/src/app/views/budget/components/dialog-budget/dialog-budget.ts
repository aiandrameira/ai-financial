import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BudgetDto, RequestBudgetDto } from "@domain/schemas";
import { BudgetFacade } from "@infra/facades";

import { FormBudget } from "../form-budget/form-budget";

@Component({
    selector: "ai-dialog-budget",
    imports: [FormBudget],
    template: `<ai-form-budget [referenceMonth]="data.referenceMonth" [budget]="data.budget" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogBudget {
    #facade = inject(BudgetFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogBudget>);

    protected readonly data = inject<{ referenceMonth: string; budget: BudgetDto | null }>(AI_DIALOG_DATA as never);

    protected onSave(payload: RequestBudgetDto): void {
        const isNew = !payload.id;

        this.#facade.save(payload).subscribe({
            next: () => {
                this.#toast.success({ message: isNew ? "Orçamento cadastrado com sucesso." : "Orçamento atualizado com sucesso." });
                this.#dialogRef.close();
            },
            error: (error: unknown) => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível salvar o orçamento.") : "Não foi possível salvar o orçamento.";
                this.#toast.destructive({ message: "Erro ao salvar orçamento", description: message });
            },
        });
    }
}
