import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AI_DIALOG_DATA, AiDatePicker, AiDialogRef, AiInput, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { form, FormField, submit, validateStandardSchema } from "@angular/forms/signals";
import { ButtonForm } from "@core/ui";
import { makeRequestInvestmentPrice, RequestInvestmentPriceDto, requestInvestmentPriceSchema } from "@domain/schemas";
import { InvestmentFacade, InvestmentPriceFacade } from "@infra/facades";

@Component({
    selector: "ai-dialog-investment-price",
    imports: [FormField, AiInput, AiDatePicker, ButtonForm],
    templateUrl: "./dialog-investment-price.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogInvestmentPrice {
    #facade = inject(InvestmentPriceFacade);
    #investmentFacade = inject(InvestmentFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogInvestmentPrice>);

    protected readonly data = inject<{ investmentId: string }>(AI_DIALOG_DATA as never);

    protected priceSchema = signal<RequestInvestmentPriceDto>(makeRequestInvestmentPrice());

    readonly form = form(this.priceSchema, schema => {
        validateStandardSchema(schema, requestInvestmentPriceSchema);
    });

    readonly loading = signal(false);

    vlMaskConfig: AiMaskConfig = {
        isCurrency: true,
        decimal: ",",
        prefix: "R$ ",
        thousands: ".",
        align: "left",
    };

    protected onDateChange(value: string): void {
        this.priceSchema.update(current => ({ ...current, referenceDate: value }));
    }

    async onSave() {
        this.loading.set(true);
        let submitted = false;

        try {
            await submit(this.form, async () => {
                submitted = true;
                const payload = this.form().value() as RequestInvestmentPriceDto;

                await this.#facade.create(this.data.investmentId, payload);
                await this.#investmentFacade.load();
                this.#toast.success({ message: "Preço atualizado com sucesso." });
                this.#dialogRef.close();
            });

            if (!submitted) {
                this.#toast.warning({
                    message: "Campos obrigatórios",
                    description: "Por favor, preencha todos os campos corretamente.",
                });
            }
        } catch (error) {
            const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível atualizar o preço.") : "Não foi possível atualizar o preço.";
            this.#toast.destructive({ message: "Erro ao atualizar preço", description: message });
        } finally {
            this.loading.set(false);
        }
    }
}
