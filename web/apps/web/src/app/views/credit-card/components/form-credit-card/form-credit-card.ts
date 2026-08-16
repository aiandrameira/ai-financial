import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiBadge, AiIcon, AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { TpAccountPipe } from "@core/pipes";
import { ButtonForm } from "@core/ui";
import { CREDIT_CARD_ICONS, CREDIT_CARD_NETWORKS } from "@domain/constants";
import { tpCreditCardNetworkEnum } from "@domain/enums";
import { AccountDto, CreditCardDto, makeRequestCreditCard, RequestCreditCardDto, requestCreditCardSchema } from "@domain/schemas";
import { CreditCardAdapter } from "@infra/adapters";
import { AccountService } from "@infra/services";

import { CreditCardPreview } from "../credit-card-preview/credit-card-preview";

@Component({
    selector: "ai-form-credit-card",
    imports: [FormField, AiInput, AiBadge, AiIcon, AiSelectImports, ButtonForm, TpAccountPipe, CreditCardPreview],
    templateUrl: "./form-credit-card.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCreditCard {
    #toast = inject(AiToastService);
    #accountService = inject(AccountService);

    #accounts = signal<AccountDto[]>([]);
    readonly accounts = this.#accounts.asReadonly();
    readonly creditCardIcons = CREDIT_CARD_ICONS;
    readonly creditCardNetworks = CREDIT_CARD_NETWORKS;

    readonly enabled = signal<boolean>(false);
    protected creditCardSchema = signal<RequestCreditCardDto>(makeRequestCreditCard());

    readonly form = form(this.creditCardSchema, schema => {
        required(schema.name, { message: "O campo nome é obrigatório." });
        validateStandardSchema(schema, requestCreditCardSchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestCreditCardDto>();
    readonly loading = signal<boolean>(false);

    readonly creditCard = input<CreditCardDto | null>(null);
    readonly id = computed(() => this.creditCard()?.id ?? "");
    readonly selectedAccount = computed(() => this.accounts().find(account => account.id === this.form().value().accountId) ?? null);

    vlMaskConfig: AiMaskConfig = {
        isCurrency: true,
        decimal: ",",
        prefix: "R$ ",
        thousands: ".",
        align: "left",
    };

    constructor() {
        this.#accountService.find().subscribe(accounts => this.#accounts.set(accounts));

        effect(() => {
            const creditCard = this.creditCard();

            untracked(() => {
                if (creditCard) {
                    this.creditCardSchema.set(CreditCardAdapter.toDto(creditCard));
                    this.enabled.set(true);
                }
            });
        });
    }

    protected onAccountChange(value: unknown): void {
        this.creditCardSchema.update(current => ({ ...current, accountId: isArrayId(value) }));
    }

    protected onNetworkChange(value: unknown): void {
        this.creditCardSchema.update(current => ({ ...current, network: isArrayId(value) as tpCreditCardNetworkEnum }));
    }

    protected onIconChange(value: unknown): void {
        this.creditCardSchema.update(current => ({ ...current, icon: isArrayId(value) }));
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            const payload = this.form().value() as RequestCreditCardDto;
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
