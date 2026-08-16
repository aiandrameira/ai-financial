import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { InvestmentAssetDto, RequestInvestmentAssetDto } from "@domain/schemas";
import { InvestmentService } from "@infra/services";
import { Observable } from "rxjs";

import { FormInvestment } from "../form-investment/form-investment";

@Component({
    selector: "ai-dialog-investment",
    imports: [FormInvestment],
    template: `<ai-form-investment [asset]="data.asset" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogInvestment {
    #service = inject(InvestmentService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogInvestment>);

    protected readonly data = inject<{ asset: InvestmentAssetDto | null }>(AI_DIALOG_DATA as never);

    protected onSave(payload: RequestInvestmentAssetDto): void {
        const isNew = !payload.id;
        const request$: Observable<unknown> = payload.id ? this.#service.update(payload.id, payload) : this.#service.create(payload);

        request$.subscribe({
            next: () => {
                this.#toast.success({ message: isNew ? "Investimento cadastrado com sucesso." : "Investimento atualizado com sucesso." });
                this.#dialogRef.close();
            },
            error: (error: unknown) => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível salvar o investimento.") : "Não foi possível salvar o investimento.";
                this.#toast.destructive({ message: "Erro ao salvar investimento", description: message });
            },
        });
    }
}
