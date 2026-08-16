import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RequestSavingsGoalDto, SavingsGoalDto } from "@domain/schemas";
import { SavingsGoalFacade } from "@infra/facades";

import { FormSavingsGoal } from "../form-savings-goal/form-savings-goal";

@Component({
    selector: "ai-dialog-savings-goal",
    imports: [FormSavingsGoal],
    template: `<ai-form-savings-goal [goal]="data.goal" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSavingsGoal {
    #facade = inject(SavingsGoalFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogSavingsGoal>);

    protected readonly data = inject<{ goal: SavingsGoalDto | null }>(AI_DIALOG_DATA as never);

    protected async onSave(payload: RequestSavingsGoalDto): Promise<void> {
        const isNew = !payload.id;

        await this.#facade.save(payload);
        this.#toast.success({ message: isNew ? "Meta cadastrada com sucesso." : "Meta atualizada com sucesso." });
        this.#dialogRef.close();
    }
}
