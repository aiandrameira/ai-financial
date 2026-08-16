import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RequestGoalContributionDto } from "@domain/schemas";
import { GoalContributionService } from "@infra/services";

import { FormGoalContribution } from "../form-goal-contribution/form-goal-contribution";

@Component({
    selector: "ai-dialog-goal-contribution",
    imports: [FormGoalContribution],
    template: `<ai-form-goal-contribution (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogGoalContribution {
    #service = inject(GoalContributionService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogGoalContribution>);

    protected readonly data = inject<{ goalId: string }>(AI_DIALOG_DATA as never);

    protected onSave(payload: RequestGoalContributionDto): void {
        this.#service.create(this.data.goalId, payload).subscribe({
            next: () => {
                this.#toast.success({ message: "Aporte registrado com sucesso." });
                this.#dialogRef.close();
            },
            error: error => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível registrar o aporte.") : "Não foi possível registrar o aporte.";
                this.#toast.destructive({ message: "Erro ao registrar aporte", description: message });
            },
        });
    }
}
