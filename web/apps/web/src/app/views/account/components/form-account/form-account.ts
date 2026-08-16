import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { BadgeTpAccount, ButtonForm } from "@core/ui";
import { ACCOUNT_TYPES } from "@domain/constants";
import { tpAccountEnum } from "@domain/enums";
import { AccountDto, makeRequestAccount, RequestAccountDto, requestAccountSchema } from "@domain/schemas";
import { AccountAdapter } from "@infra/adapters";

@Component({
    selector: "ai-form-account",
    imports: [FormField, AiInput, AiSelectImports, ButtonForm, BadgeTpAccount],
    templateUrl: "./form-account.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormAccount {
    #toast = inject(AiToastService);

    readonly accountTypes = ACCOUNT_TYPES;

    readonly enabled = signal<boolean>(false);
    protected accountSchema = signal<RequestAccountDto>(makeRequestAccount());

    readonly form = form(this.accountSchema, schema => {
        required(schema.name, { message: "O campo nome é obrigatório." });
        validateStandardSchema(schema, requestAccountSchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestAccountDto>();
    readonly loading = signal<boolean>(false);

    readonly account = input<AccountDto | null>(null);
    readonly id = computed(() => this.account()?.id ?? "");
    readonly selectedType = computed(() => this.form().value().type);

    vlMaskConfig: AiMaskConfig = {
        isCurrency: true,
        decimal: ",",
        prefix: "R$ ",
        thousands: ".",
        align: "left",
    };

    constructor() {
        effect(() => {
            const account = this.account();

            untracked(() => {
                if (account) {
                    this.accountSchema.set(AccountAdapter.toDto(account));
                    this.enabled.set(true);
                }
            });
        });
    }

    protected onTypeChange(value: unknown): void {
        const type = (Array.isArray(value) ? value[0] : value) as tpAccountEnum;
        this.accountSchema.update(current => ({ ...current, type }));
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            const payload = this.form().value() as RequestAccountDto;
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
