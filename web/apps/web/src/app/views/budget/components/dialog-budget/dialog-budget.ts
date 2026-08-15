import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
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

    protected async onSave(payload: RequestBudgetDto): Promise<void> {
        const isNew = !payload.id;

        await this.#facade.save(payload);
        this.#toast.success({ message: isNew ? "Orçamento cadastrado com sucesso." : "Orçamento atualizado com sucesso." });
        this.#dialogRef.close();
    }
}
