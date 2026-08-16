import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CreditCardDto, RequestCreditCardDto } from "@domain/schemas";
import { CreditCardService } from "@infra/services";
import { Observable } from "rxjs";

import { FormCreditCard } from "../form-credit-card/form-credit-card";

@Component({
    selector: "ai-dialog-credit-card",
    imports: [FormCreditCard],
    template: `<ai-form-credit-card [creditCard]="data.creditCard" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCreditCard {
    #service = inject(CreditCardService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogCreditCard>);

    protected readonly data = inject<{ creditCard: CreditCardDto | null }>(AI_DIALOG_DATA as never);

    protected onSave(payload: RequestCreditCardDto): void {
        const isNew = !payload.id;
        const request$: Observable<unknown> = payload.id ? this.#service.update(payload.id, payload) : this.#service.create(payload);

        request$.subscribe({
            next: () => {
                this.#toast.success({ message: isNew ? "Cartão cadastrado com sucesso." : "Cartão atualizado com sucesso." });
                this.#dialogRef.close();
            },
            error: (error: unknown) => {
                const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível salvar o cartão.") : "Não foi possível salvar o cartão.";
                this.#toast.destructive({ message: "Erro ao salvar cartão", description: message });
            },
        });
    }
}
