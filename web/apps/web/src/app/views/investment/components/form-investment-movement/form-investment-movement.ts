import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiDatePicker, AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject, output, signal } from "@angular/core";
import { disabled, form, FormField, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { BadgeTpInvestmentMovement, ButtonForm } from "@core/ui";
import { INVESTMENT_MOVEMENT_TYPES } from "@domain/constants";
import { tpInvestmentMovementEnum } from "@domain/enums";
import { makeRequestInvestmentMovement, RequestInvestmentMovementDto, requestInvestmentMovementSchema } from "@domain/schemas";

@Component({
    selector: "ai-form-investment-movement",
    imports: [FormField, AiInput, AiSelectImports, ButtonForm, BadgeTpInvestmentMovement, AiDatePicker],
    templateUrl: "./form-investment-movement.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInvestmentMovement {
    #toast = inject(AiToastService);

    readonly movementTypes = INVESTMENT_MOVEMENT_TYPES;

    readonly enabled = signal<boolean>(false);
    protected movementSchema = signal<RequestInvestmentMovementDto>(makeRequestInvestmentMovement());

    readonly form = form(this.movementSchema, schema => {
        validateStandardSchema(schema, requestInvestmentMovementSchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestInvestmentMovementDto>();
    readonly loading = signal<boolean>(false);

    vlMaskConfig: AiMaskConfig = {
        isCurrency: true,
        decimal: ",",
        prefix: "R$ ",
        thousands: ".",
        align: "left",
    };

    protected onTypeChange(value: unknown): void {
        this.movementSchema.update(current => ({ ...current, type: isArrayId(value) as tpInvestmentMovementEnum }));
    }

    protected onDateChange(value: string): void {
        this.movementSchema.update(current => ({ ...current, date: value }));
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            const payload = this.form().value() as RequestInvestmentMovementDto;
            this.save.emit(payload);
        });

        if (!submitted) {
            this.#toast.warning({
                message: "Campos obrigatórios",
                description: "Por favor, preencha todos os campos corretamente.",
            });
        }
        this.loading.set(false);
    }
}
