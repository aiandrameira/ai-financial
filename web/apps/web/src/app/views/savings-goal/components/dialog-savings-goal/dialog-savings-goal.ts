import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RequestSavingsGoalDto, SavingsGoalDto } from "@domain/schemas";
import { SavingsGoalService } from "@infra/services";
import { Observable } from "rxjs";

import { FormSavingsGoal } from "../form-savings-goal/form-savings-goal";

@Component({
    selector: "ai-dialog-savings-goal",
    imports: [FormSavingsGoal],
    template: `<ai-form-savings-goal [goal]="data.goal" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSavingsGoal {
    #service = inject(SavingsGoalService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogSavingsGoal>);

    protected readonly data = inject<{ goal: SavingsGoalDto | null }>(AI_DIALOG_DATA as never);

    protected onSave(payload: RequestSavingsGoalDto): void {
        const isNew = !payload.id;
        const request$: Observable<unknown> = payload.id ? this.#service.update(payload.id, payload) : this.#service.create(payload);

        request$.subscribe({
            next: () => {
                this.#toast.success({ message: isNew ? "Meta cadastrada com sucesso." : "Meta atualizada com sucesso." });
                this.#dialogRef.close();
            },
            error: (error: unknown) => {
                const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível salvar a meta.") : "Não foi possível salvar a meta.";
                this.#toast.destructive({ message: "Erro ao salvar meta", description: message });
            },
        });
    }
}
