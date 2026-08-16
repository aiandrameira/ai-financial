import type { AiIconType, AiMaskConfig } from "@aiandralves/ai-ui";
import { AiBadge, AiDatePicker, AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from "@angular/core";
import { disabled, form, FormField, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { ButtonForm } from "@core/ui";
import { tpInvestmentMovementEnum, tpInvestmentMovementMap } from "@domain/enums";
import { makeRequestInvestmentMovement, RequestInvestmentMovementDto, requestInvestmentMovementSchema } from "@domain/schemas";

const MOVEMENT_TYPE_ICONS: Record<tpInvestmentMovementEnum, AiIconType> = {
    [tpInvestmentMovementEnum.BUY]: "arrow-down-circle",
    [tpInvestmentMovementEnum.SELL]: "arrow-up-circle",
    [tpInvestmentMovementEnum.DIVIDEND]: "hand-coin",
    [tpInvestmentMovementEnum.CONTRIBUTION]: "add-circle",
    [tpInvestmentMovementEnum.WITHDRAWAL]: "arrow-right",
};

const MOVEMENT_TYPES: { value: tpInvestmentMovementEnum; label: string; icon: AiIconType }[] = Array.from(tpInvestmentMovementMap, ([value, label]) => ({
    value,
    label,
    icon: MOVEMENT_TYPE_ICONS[value],
}));

@Component({
    selector: "ai-form-investment-movement",
    imports: [FormField, AiInput, AiBadge, AiSelectImports, ButtonForm, AiDatePicker],
    templateUrl: "./form-investment-movement.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInvestmentMovement {
    #toast = inject(AiToastService);

    readonly movementTypes = MOVEMENT_TYPES;

    readonly enabled = signal<boolean>(false);
    protected movementSchema = signal<RequestInvestmentMovementDto>(makeRequestInvestmentMovement());

    readonly form = form(this.movementSchema, schema => {
        validateStandardSchema(schema, requestInvestmentMovementSchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestInvestmentMovementDto>();
    readonly loading = signal<boolean>(false);

    readonly selectedType = computed(() => this.movementTypes.find(type => type.value === this.form().value().type) ?? null);

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

    async onSave() {
        this.loading.set(true);
        let submitted = false;

        try {
            await submit(this.form, async () => {
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
        } catch (error) {
            console.error("Erro ao submeter formulário:", error);
        } finally {
            this.loading.set(false);
        }
    }
}
