import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiInput, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, submit, validateStandardSchema } from "@angular/forms/signals";
import { ButtonForm } from "@core/ui";
import { FinancialSettingsDto, makeRequestFinancialSettings, RequestFinancialSettingsDto, requestFinancialSettingsSchema } from "@domain/schemas";

@Component({
    selector: "ai-form-financial-settings",
    imports: [FormField, AiInput, ButtonForm],
    templateUrl: "./form-financial-settings.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFinancialSettings {
    #toast = inject(AiToastService);

    readonly settings = input<FinancialSettingsDto | null>(null);

    readonly enabled = signal<boolean>(true);
    protected settingsSchema = signal<RequestFinancialSettingsDto>(makeRequestFinancialSettings());

    readonly form = form(this.settingsSchema, schema => {
        validateStandardSchema(schema, requestFinancialSettingsSchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestFinancialSettingsDto>();
    readonly loading = signal<boolean>(false);

    vlMaskConfig: AiMaskConfig = {
        isCurrency: true,
        decimal: ",",
        prefix: "R$ ",
        thousands: ".",
        align: "left",
    };

    constructor() {
        effect(() => {
            const settings = this.settings();

            untracked(() => {
                if (settings) this.settingsSchema.set(makeRequestFinancialSettings({ monthlyIncome: Number(settings.monthlyIncome) }));
            });
        });
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            this.save.emit(this.form().value() as RequestFinancialSettingsDto);
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
