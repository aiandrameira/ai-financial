import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FinancialSettingsDto, RequestFinancialSettingsDto } from "@domain/schemas";
import { FinancialPlanFacade } from "@infra/facades";

import { FormFinancialSettings } from "../form-financial-settings/form-financial-settings";

@Component({
    selector: "ai-dialog-financial-settings",
    imports: [FormFinancialSettings],
    template: `<ai-form-financial-settings [settings]="data.settings" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogFinancialSettings {
    #facade = inject(FinancialPlanFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogFinancialSettings>);

    protected readonly data = inject<{ settings: FinancialSettingsDto }>(AI_DIALOG_DATA as never);

    protected onSave(payload: RequestFinancialSettingsDto): void {
        this.#facade.updateIncome(payload).subscribe({
            next: () => {
                this.#toast.success({ message: "Renda mensal atualizada com sucesso." });
                this.#dialogRef.close();
            },
            error: (error: unknown) => {
                const message =
                    error instanceof HttpErrorResponse
                        ? (error.error?.meta?.message ?? "Não foi possível atualizar a renda mensal.")
                        : "Não foi possível atualizar a renda mensal.";
                this.#toast.destructive({ message: "Erro ao salvar renda", description: message });
            },
        });
    }
}
