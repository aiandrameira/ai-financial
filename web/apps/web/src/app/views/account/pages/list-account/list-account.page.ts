import { AiButton, AiDialogService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { formDialogOptions } from "@core/utils";
import { AccountDto } from "@domain/schemas";

import { AiHeading } from "@core/ui";
import { DialogAccount, TableAccount } from "../../components";

@Component({
    selector: "ai-list-account",
    imports: [AiButton, TableAccount, AiHeading],
    templateUrl: "./list-account.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListAccountPage {
    #dialog = inject(AiDialogService);

    protected openCreate() {
        this._openDialog(null);
    }

    protected openEdit(account: AccountDto) {
        this._openDialog(account);
    }

    private _openDialog(account: AccountDto | null) {
        const isNew = !account;

        this.#dialog.create<DialogAccount, { account: AccountDto | null }>({
            ...formDialogOptions(isNew ? "Cadastrar conta" : "Editar conta", "Preencha os dados da conta.", "wallet"),
            component: DialogAccount,
            data: { account },
        });
    }
}
