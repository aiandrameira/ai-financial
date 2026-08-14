import { AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RequestTransferDto } from "@domain/schemas";
import { TransactionFacade } from "@infra/facades";

import { FormTransfer } from "../form-transfer/form-transfer";

@Component({
    selector: "ai-dialog-transfer",
    imports: [FormTransfer],
    template: `<ai-form-transfer (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogTransfer {
    #facade = inject(TransactionFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogTransfer>);

    protected async onSave(payload: RequestTransferDto): Promise<void> {
        await this.#facade.createTransfer(payload);
        this.#toast.success({ message: "Transferência realizada com sucesso." });
        this.#dialogRef.close();
    }
}
