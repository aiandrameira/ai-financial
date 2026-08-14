import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AccountDto, RequestAccountDto } from "@domain/schemas";
import { AccountFacade } from "@infra/facades";

import { FormAccount } from "../form-account/form-account";

@Component({
    selector: "ai-dialog-account",
    imports: [FormAccount],
    template: `<ai-form-account [account]="data.account" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAccount {
    #facade = inject(AccountFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogAccount>);

    protected readonly data = inject<{ account: AccountDto | null }>(AI_DIALOG_DATA as never);

    protected async onSave(payload: RequestAccountDto): Promise<void> {
        const isNew = !payload.id;

        await this.#facade.save(payload);
        this.#toast.success({ message: isNew ? "Conta cadastrada com sucesso." : "Conta atualizada com sucesso." });
        this.#dialogRef.close();
    }
}
