import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiBadge, AiDatePicker, AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { ButtonForm } from "@core/ui";
import { ASSET_TYPES } from "@domain/constants";
import { tpAssetEnum } from "@domain/enums";
import { AssetDto, makeRequestAsset, RequestAssetDto, requestAssetSchema } from "@domain/schemas";
import { AssetAdapter } from "@infra/adapters";

@Component({
    selector: "ai-form-asset",
    imports: [FormField, AiInput, AiBadge, AiSelectImports, ButtonForm, AiDatePicker],
    templateUrl: "./form-asset.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormAsset {
    #toast = inject(AiToastService);

    readonly assetTypes = ASSET_TYPES;

    readonly asset = input<AssetDto | null>(null);
    readonly id = computed(() => this.asset()?.id ?? "");
    readonly isNew = computed(() => !this.id());

    readonly enabled = signal<boolean>(false);
    protected assetSchema = signal<RequestAssetDto>(makeRequestAsset());

    readonly form = form(this.assetSchema, schema => {
        required(schema.name, { message: "O campo nome é obrigatório." });
        validateStandardSchema(schema, requestAssetSchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestAssetDto>();
    readonly loading = signal<boolean>(false);

    readonly selectedType = computed(() => this.assetTypes.find(type => type.value === this.form().value().type) ?? null);

    vlMaskConfig: AiMaskConfig = {
        isCurrency: true,
        decimal: ",",
        prefix: "R$ ",
        thousands: ".",
        align: "left",
    };

    constructor() {
        effect(() => {
            const asset = this.asset();

            untracked(() => {
                if (asset) {
                    this.assetSchema.set(AssetAdapter.toDto(asset));
                    this.enabled.set(true);
                }
            });
        });
    }

    protected onTypeChange(value: unknown): void {
        this.assetSchema.update(current => ({ ...current, type: isArrayId(value) as tpAssetEnum }));
    }

    protected onDateChange(value: string): void {
        this.assetSchema.update(current => ({ ...current, acquiredAt: value }));
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            const payload = this.form().value() as RequestAssetDto;
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
