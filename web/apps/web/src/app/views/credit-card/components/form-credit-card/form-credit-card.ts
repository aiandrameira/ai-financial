import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiIcon, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { BadgeTpAccount, BadgeTpCreditCardNetwork, FormImports } from "@core/ui";
import { CREDIT_CARD_NETWORKS } from "@domain/constants";
import { tpCreditCardNetworkEnum } from "@domain/enums";
import { CreditCardDto, makeRequestCreditCard, RequestCreditCardDto, requestCreditCardSchema } from "@domain/schemas";
import { CreditCardAdapter } from "@infra/adapters";
import { CreditCardFacade } from "@infra/facades";

import { CreditCardPreview } from "../credit-card-preview/credit-card-preview";

@Component({
    selector: "ai-form-credit-card",
    imports: [FormImports, AiIcon, BadgeTpCreditCardNetwork, BadgeTpAccount, CreditCardPreview],
    templateUrl: "./form-credit-card.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCreditCard {
    #toast = inject(AiToastService);
    #facade = inject(CreditCardFacade);

    readonly accounts = this.#facade.accounts;
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
        this.#facade.load();

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
