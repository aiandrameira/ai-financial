import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RequestGoalContributionDto } from "@domain/schemas";
import { GoalContributionFacade, SavingsGoalFacade } from "@infra/facades";

import { FormGoalContribution } from "../form-goal-contribution/form-goal-contribution";

@Component({
    selector: "ai-dialog-goal-contribution",
    imports: [FormGoalContribution],
    template: `<ai-form-goal-contribution (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogGoalContribution {
    #facade = inject(GoalContributionFacade);
    #goalFacade = inject(SavingsGoalFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogGoalContribution>);

    protected readonly data = inject<{ goalId: string }>(AI_DIALOG_DATA as never);

    protected async onSave(payload: RequestGoalContributionDto): Promise<void> {
        try {
            await this.#facade.create(this.data.goalId, payload);
            await this.#goalFacade.load();
            this.#toast.success({ message: "Aporte registrado com sucesso." });
            this.#dialogRef.close();
        } catch (error) {
            const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível registrar o aporte.") : "Não foi possível registrar o aporte.";
            this.#toast.destructive({ message: "Erro ao registrar aporte", description: message });
        }
    }
}
