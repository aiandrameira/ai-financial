import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LoanDto, RequestLoanDto } from "@domain/schemas";
import { LoanFacade } from "@infra/facades";

import { FormLoan } from "../form-loan/form-loan";

@Component({
    selector: "ai-dialog-loan",
    imports: [FormLoan],
    template: `<ai-form-loan [loan]="data.loan" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogLoan {
    #facade = inject(LoanFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogLoan>);

    protected readonly data = inject<{ loan: LoanDto | null }>(AI_DIALOG_DATA as never);

    protected async onSave(payload: RequestLoanDto): Promise<void> {
        const isNew = !payload.id;

        await this.#facade.save(payload);
        this.#toast.success({ message: isNew ? "Financiamento cadastrado com sucesso." : "Financiamento atualizado com sucesso." });
        this.#dialogRef.close();
    }
}
