import { AiButton, AiDialogService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { LoanDto } from "@domain/schemas";

import { DialogLoan, TableLoan } from "../../components";

@Component({
    selector: "ai-list-loan",
    imports: [AiButton, AiHeading, TableLoan],
    templateUrl: "./list-loan.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLoanPage {
    #dialog = inject(AiDialogService);

    protected openCreate(): void {
        this._openDialog(null);
    }

    protected openEdit(loan: LoanDto): void {
        this._openDialog(loan);
    }

    private _openDialog(loan: LoanDto | null): void {
        const isNew = !loan;

        this.#dialog.create<DialogLoan, { loan: LoanDto | null }>({
            ...formDialogOptions(isNew ? "Cadastrar financiamento" : "Editar financiamento", "Preencha os dados do financiamento.", "file-list"),
            width: "560px",
            component: DialogLoan,
            data: { loan },
        });
    }
}
