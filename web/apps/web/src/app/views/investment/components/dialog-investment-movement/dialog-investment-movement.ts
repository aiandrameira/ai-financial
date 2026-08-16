import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RequestInvestmentMovementDto } from "@domain/schemas";
import { InvestmentFacade, InvestmentMovementFacade } from "@infra/facades";

import { FormInvestmentMovement } from "../form-investment-movement/form-investment-movement";

@Component({
    selector: "ai-dialog-investment-movement",
    imports: [FormInvestmentMovement],
    template: `<ai-form-investment-movement (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogInvestmentMovement {
    #facade = inject(InvestmentMovementFacade);
    #investmentFacade = inject(InvestmentFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogInvestmentMovement>);

    protected readonly data = inject<{ investmentId: string }>(AI_DIALOG_DATA as never);

    protected async onSave(payload: RequestInvestmentMovementDto): Promise<void> {
        try {
            await this.#facade.create(this.data.investmentId, payload);
            await this.#investmentFacade.load();
            this.#toast.success({ message: "Movimentação registrada com sucesso." });
            this.#dialogRef.close();
        } catch (error) {
            const message =
                error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível registrar a movimentação.") : "Não foi possível registrar a movimentação.";
            this.#toast.destructive({ message: "Erro ao registrar movimentação", description: message });
        }
    }
}
