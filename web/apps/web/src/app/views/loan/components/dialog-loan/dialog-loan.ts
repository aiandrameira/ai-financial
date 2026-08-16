import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LoanDto, RequestLoanDto } from "@domain/schemas";
import { LoanService } from "@infra/services";
import { Observable } from "rxjs";

import { FormLoan } from "../form-loan/form-loan";

@Component({
    selector: "ai-dialog-loan",
    imports: [FormLoan],
    template: `<ai-form-loan [loan]="data.loan" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogLoan {
    #service = inject(LoanService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogLoan>);

    protected readonly data = inject<{ loan: LoanDto | null }>(AI_DIALOG_DATA as never);

    protected onSave(payload: RequestLoanDto): void {
        const isNew = !payload.id;
        const request$: Observable<unknown> = payload.id ? this.#service.update(payload.id, payload) : this.#service.create(payload);

        request$.subscribe({
            next: () => {
                this.#toast.success({ message: isNew ? "Financiamento cadastrado com sucesso." : "Financiamento atualizado com sucesso." });
                this.#dialogRef.close();
            },
            error: (error: unknown) => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível salvar o financiamento.") : "Não foi possível salvar o financiamento.";
                this.#toast.destructive({ message: "Erro ao salvar financiamento", description: message });
            },
        });
    }
}
