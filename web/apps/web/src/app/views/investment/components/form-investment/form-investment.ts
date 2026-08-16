import { AiBadge, AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { ButtonForm } from "@core/ui";
import { INVESTMENT_TYPES } from "@domain/constants";
import { tpInvestmentEnum } from "@domain/enums";
import { InvestmentAssetDto, makeRequestInvestmentAsset, RequestInvestmentAssetDto, requestInvestmentAssetSchema } from "@domain/schemas";
import { InvestmentAdapter } from "@infra/adapters";

@Component({
    selector: "ai-form-investment",
    imports: [FormField, AiInput, AiBadge, AiSelectImports, ButtonForm],
    templateUrl: "./form-investment.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInvestment {
    #toast = inject(AiToastService);

    readonly investmentTypes = INVESTMENT_TYPES;

    readonly asset = input<InvestmentAssetDto | null>(null);
    readonly id = computed(() => this.asset()?.id ?? "");
    readonly isNew = computed(() => !this.id());

    readonly enabled = signal<boolean>(false);
    protected investmentSchema = signal<RequestInvestmentAssetDto>(makeRequestInvestmentAsset());

    readonly form = form(this.investmentSchema, schema => {
        required(schema.name, { message: "O campo nome é obrigatório." });
        validateStandardSchema(schema, requestInvestmentAssetSchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestInvestmentAssetDto>();
    readonly loading = signal<boolean>(false);

    readonly selectedType = computed(() => this.investmentTypes.find(type => type.value === this.form().value().type) ?? null);

    constructor() {
        effect(() => {
            const asset = this.asset();

            untracked(() => {
                if (asset) {
                    this.investmentSchema.set(InvestmentAdapter.toDto(asset));
                    this.enabled.set(true);
                }
            });
        });
    }

    protected onTypeChange(value: unknown): void {
        this.investmentSchema.update(current => ({ ...current, type: isArrayId(value) as tpInvestmentEnum }));
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            const payload = this.form().value() as RequestInvestmentAssetDto;
            const id = this.id();
            this.save.emit({ ...payload, ...(id ? { id } : {}) });
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
