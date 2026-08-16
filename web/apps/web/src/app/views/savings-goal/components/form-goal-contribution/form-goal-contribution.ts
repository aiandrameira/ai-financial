import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiDatePicker, AiInput, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject, output, signal } from "@angular/core";
import { disabled, form, FormField, submit, validateStandardSchema } from "@angular/forms/signals";
import { ButtonForm } from "@core/ui";
import { makeRequestGoalContribution, RequestGoalContributionDto, requestGoalContributionSchema } from "@domain/schemas";

@Component({
    selector: "ai-form-goal-contribution",
    imports: [FormField, AiInput, ButtonForm, AiDatePicker],
    templateUrl: "./form-goal-contribution.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormGoalContribution {
    #toast = inject(AiToastService);

    readonly enabled = signal<boolean>(false);
    protected contributionSchema = signal<RequestGoalContributionDto>(makeRequestGoalContribution());

    readonly form = form(this.contributionSchema, schema => {
        validateStandardSchema(schema, requestGoalContributionSchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestGoalContributionDto>();
    readonly loading = signal<boolean>(false);

    vlMaskConfig: AiMaskConfig = {
        isCurrency: true,
        decimal: ",",
        prefix: "R$ ",
        thousands: ".",
        align: "left",
    };

    protected onDateChange(value: string): void {
        this.contributionSchema.update(current => ({ ...current, date: value }));
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            const payload = this.form().value() as RequestGoalContributionDto;
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
