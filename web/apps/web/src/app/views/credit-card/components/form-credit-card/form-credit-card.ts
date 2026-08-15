import type { AiIconType, AiMaskConfig } from "@aiandralves/ai-ui";
import { AiBadge, AiIcon, AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { TpAccountPipe } from "@core/pipes";
import { ButtonForm } from "@core/ui";
import { tpCreditCardNetworkEnum, tpCreditCardNetworkMap } from "@domain/enums";
import { CreditCardDto, makeRequestCreditCard, RequestCreditCardDto, requestCreditCardSchema } from "@domain/schemas";
import { CreditCardAdapter } from "@infra/adapters";
import { AccountFacade } from "@infra/facades";

import { CreditCardPreview } from "../credit-card-preview/credit-card-preview";

const CREDIT_CARD_ICONS: AiIconType[] = ["bank-card", "bank", "wallet", "money-dollar-circle", "shield-check", "safe"];

const CREDIT_CARD_NETWORKS: { value: tpCreditCardNetworkEnum; label: string }[] = Array.from(tpCreditCardNetworkMap, ([value, label]) => ({ value, label }));

@Component({
    selector: "ai-form-credit-card",
    imports: [FormField, AiInput, AiBadge, AiIcon, AiSelectImports, ButtonForm, TpAccountPipe, CreditCardPreview],
    templateUrl: "./form-credit-card.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCreditCard {
    #toast = inject(AiToastService);
    #accountFacade = inject(AccountFacade);

    readonly accounts = this.#accountFacade.accounts;
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
        this.#accountFacade.load();

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

    async onSave() {
        this.loading.set(true);
        let submitted = false;

        try {
            await submit(this.form, async () => {
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
        } catch (error) {
            console.error("Erro ao submeter formulário:", error);
        } finally {
            this.loading.set(false);
        }
    }
}
