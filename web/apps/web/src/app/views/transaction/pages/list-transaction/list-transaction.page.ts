import { AiButton, AiDialogService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { TransactionDto } from "@domain/schemas";

import { DialogTransaction, DialogTransfer, TableTransaction } from "../../components";

@Component({
    selector: "ai-list-transaction",
    imports: [AiButton, TableTransaction, AiHeading],
    templateUrl: "./list-transaction.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListTransactionPage {
    #dialog = inject(AiDialogService);

    protected openCreate() {
        this._openDialog(null);
    }

    protected openEdit(transaction: TransactionDto) {
        this._openDialog(transaction);
    }

    protected openTransfer() {
        this.#dialog.create<DialogTransfer, never>({
            ...formDialogOptions("Nova transferência", "Transfira valores entre suas contas.", "exchange"),
            component: DialogTransfer,
        });
    }

    private _openDialog(transaction: TransactionDto | null) {
        const isNew = !transaction;

        this.#dialog.create<DialogTransaction, { transaction: TransactionDto | null }>({
            ...formDialogOptions(isNew ? "Cadastrar transação" : "Editar transação", "Preencha os dados da transação.", "exchange"),
            component: DialogTransaction,
            data: { transaction },
        });
    }
}
