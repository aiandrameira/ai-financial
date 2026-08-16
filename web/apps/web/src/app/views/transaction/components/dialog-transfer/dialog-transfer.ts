import { AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
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

    protected onSave(payload: RequestTransferDto): void {
        this.#facade.createTransfer(payload).subscribe({
            next: () => {
                this.#toast.success({ message: "Transferência realizada com sucesso." });
                this.#dialogRef.close();
            },
            error: error => {
                const message =
                    error instanceof HttpErrorResponse
                        ? (error.error?.meta?.message ?? "Não foi possível realizar a transferência.")
                        : "Não foi possível realizar a transferência.";
                this.#toast.destructive({ message: "Erro ao realizar transferência", description: message });
            },
        });
    }
}
