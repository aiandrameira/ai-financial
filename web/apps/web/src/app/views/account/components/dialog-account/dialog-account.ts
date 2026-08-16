import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AccountDto, RequestAccountDto } from "@domain/schemas";
import { AccountService } from "@infra/services";
import { Observable } from "rxjs";

import { FormAccount } from "../form-account/form-account";

@Component({
    selector: "ai-dialog-account",
    imports: [FormAccount],
    template: `<ai-form-account [account]="data.account" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAccount {
    #service = inject(AccountService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogAccount>);

    protected readonly data = inject<{ account: AccountDto | null }>(AI_DIALOG_DATA as never);

    protected onSave(payload: RequestAccountDto): void {
        const isNew = !payload.id;
        const request$: Observable<unknown> = payload.id ? this.#service.update(payload.id, payload) : this.#service.create(payload);

        request$.subscribe({
            next: () => {
                this.#toast.success({ message: isNew ? "Conta cadastrada com sucesso." : "Conta atualizada com sucesso." });
                this.#dialogRef.close();
            },
            error: (error: unknown) => {
                const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível salvar a conta.") : "Não foi possível salvar a conta.";
                this.#toast.destructive({ message: "Erro ao salvar conta", description: message });
            },
        });
    }
}
