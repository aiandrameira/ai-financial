import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RequestTransactionDto, TransactionDto } from "@domain/schemas";
import { TransactionFacade } from "@infra/facades";

import { FormTransaction } from "../form-transaction/form-transaction";

@Component({
    selector: "ai-dialog-transaction",
    imports: [FormTransaction],
    template: `<ai-form-transaction [transaction]="data.transaction" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogTransaction {
    #facade = inject(TransactionFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogTransaction>);

    protected readonly data = inject<{ transaction: TransactionDto | null }>(AI_DIALOG_DATA as never);

    protected async onSave(payload: RequestTransactionDto): Promise<void> {
        const isNew = !payload.id;

        await this.#facade.save(payload);
        this.#toast.success({ message: isNew ? "Transação lançada com sucesso." : "Transação atualizada com sucesso." });
        this.#dialogRef.close();
    }
}
