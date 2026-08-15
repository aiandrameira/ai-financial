import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CreditCardDto, RequestCreditCardDto } from "@domain/schemas";
import { CreditCardFacade } from "@infra/facades";

import { FormCreditCard } from "../form-credit-card/form-credit-card";

@Component({
    selector: "ai-dialog-credit-card",
    imports: [FormCreditCard],
    template: `<ai-form-credit-card [creditCard]="data.creditCard" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCreditCard {
    #facade = inject(CreditCardFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogCreditCard>);

    protected readonly data = inject<{ creditCard: CreditCardDto | null }>(AI_DIALOG_DATA as never);

    protected async onSave(payload: RequestCreditCardDto): Promise<void> {
        const isNew = !payload.id;

        await this.#facade.save(payload);
        this.#toast.success({ message: isNew ? "Cartão cadastrado com sucesso." : "Cartão atualizado com sucesso." });
        this.#dialogRef.close();
    }
}
