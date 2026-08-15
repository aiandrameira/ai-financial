import { AiButton, AiDialogService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { CreditCardDto } from "@domain/schemas";

import { DialogCreditCard, TableCreditCard } from "../../components";

@Component({
    selector: "ai-list-credit-card",
    imports: [AiButton, TableCreditCard, AiHeading],
    templateUrl: "./list-credit-card.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCreditCardPage {
    #dialog = inject(AiDialogService);

    protected openCreate() {
        this._openDialog(null);
    }

    protected openEdit(creditCard: CreditCardDto) {
        this._openDialog(creditCard);
    }

    private _openDialog(creditCard: CreditCardDto | null) {
        const isNew = !creditCard;

        this.#dialog.create<DialogCreditCard, { creditCard: CreditCardDto | null }>({
            ...formDialogOptions(isNew ? "Cadastrar cartão" : "Editar cartão", "Preencha os dados do cartão.", "bank-card"),
            width: "900px",
            customClasses: "lg:max-w-[900px] w-full",
            component: DialogCreditCard,
            data: { creditCard },
        });
    }
}
