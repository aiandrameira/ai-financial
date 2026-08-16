import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { InvestmentAssetDto, RequestInvestmentAssetDto } from "@domain/schemas";
import { InvestmentFacade } from "@infra/facades";

import { FormInvestment } from "../form-investment/form-investment";

@Component({
    selector: "ai-dialog-investment",
    imports: [FormInvestment],
    template: `<ai-form-investment [asset]="data.asset" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogInvestment {
    #facade = inject(InvestmentFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogInvestment>);

    protected readonly data = inject<{ asset: InvestmentAssetDto | null }>(AI_DIALOG_DATA as never);

    protected async onSave(payload: RequestInvestmentAssetDto): Promise<void> {
        const isNew = !payload.id;

        await this.#facade.save(payload);
        this.#toast.success({ message: isNew ? "Investimento cadastrado com sucesso." : "Investimento atualizado com sucesso." });
        this.#dialogRef.close();
    }
}
