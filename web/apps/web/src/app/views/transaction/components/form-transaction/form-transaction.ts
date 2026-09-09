import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiButtonToggle, AiSwitch, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { BadgeCategory, BadgeTpAccount, BadgeTpTransaction, FormImports } from "@core/ui";
import { matchesCategoryType } from "@core/utils";
import { RECURRENCE_FREQUENCY_ITEMS, TRANSACTION_ORIGIN_ITEMS, TRANSACTION_TYPES } from "@domain/constants";
import { tpRecurrenceFrequencyEnum, tpTransactionEnum } from "@domain/enums";
import { makeRequestTransaction, RequestTransactionDto, requestTransactionSchema, TransactionDto } from "@domain/schemas";
import { TransactionAdapter } from "@infra/adapters";
import { TransactionFacade } from "@infra/facades";

type TransactionOrigin = "account" | "creditCard";

@Component({
    selector: "ai-form-transaction",
    imports: [FormImports, AiButtonToggle, AiSwitch, BadgeTpTransaction, BadgeCategory, BadgeTpAccount],
    templateUrl: "./form-transaction.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTransaction {
    #toast = inject(AiToastService);
    #facade = inject(TransactionFacade);

    readonly transactionTypes = TRANSACTION_TYPES;
    readonly accounts = this.#facade.accounts;
    readonly creditCards = this.#facade.creditCards;
    readonly originItems = TRANSACTION_ORIGIN_ITEMS;

    readonly enabled = signal<boolean>(false);
    readonly origin = signal<TransactionOrigin>("account");
    readonly parcelar = signal<boolean>(false);
    readonly recorrente = signal<boolean>(false);
    readonly recurrenceFrequencyItems = RECURRENCE_FREQUENCY_ITEMS;
    protected transactionSchema = signal<RequestTransactionDto>(makeRequestTransaction());

    readonly form = form(this.transactionSchema, schema => {
        required(schema.accountId, { message: "Selecione uma conta.", when: ({ valueOf }) => !valueOf(schema.creditCardId) });
        required(schema.creditCardId, { message: "Selecione um cartão.", when: ({ valueOf }) => !valueOf(schema.accountId) });
        validateStandardSchema(schema, requestTransactionSchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestTransactionDto>();
    readonly loading = signal<boolean>(false);

    readonly transaction = input<TransactionDto | null>(null);
    readonly id = computed(() => this.transaction()?.id ?? "");

    readonly categoriesForType = computed(() => this.#facade.categories().filter(category => matchesCategoryType(category.type, this.transactionSchema().type)));
    readonly selectedType = computed(() => this.form().value().type);
    readonly selectedAccount = computed(() => this.accounts().find(account => account.id === this.form().value().accountId) ?? null);
    readonly selectedCreditCard = computed(() => this.creditCards().find(creditCard => creditCard.id === this.form().value().creditCardId) ?? null);
    readonly selectedCategory = computed(() => this.categoriesForType().find(category => category.id === this.form().value().categoryId) ?? null);
    readonly canInstall = computed(() => this.origin() === "creditCard" && this.form().value().type === tpTransactionEnum.EXPENSE && !this.id());
    readonly canRecur = computed(() => this.origin() === "account" && !this.id());

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
            const transaction = this.transaction();

            untracked(() => {
                if (transaction) {
                    const dto = TransactionAdapter.toDto(transaction);
                    this.transactionSchema.set(dto);
                    this.origin.set(dto.creditCardId ? "creditCard" : "account");
                    this.enabled.set(true);
                }
            });
        });
    }

    protected onOriginChange(value: unknown): void {
        const origin = (Array.isArray(value) ? value[0] : value) as TransactionOrigin;
        this.origin.set(origin);
        this.parcelar.set(false);
        this.recorrente.set(false);
        this.transactionSchema.update(current => ({ ...current, accountId: "", creditCardId: "", installments: 1, recurrence: undefined }));
    }

    protected onTypeChange(value: unknown): void {
        const type = (Array.isArray(value) ? value[0] : value) as RequestTransactionDto["type"];
        this.parcelar.set(false);
        this.transactionSchema.update(current => ({ ...current, type, categoryId: "", installments: 1 }));
    }

    protected onParcelarChange(checked: boolean): void {
        this.parcelar.set(checked);
        this.transactionSchema.update(current => ({ ...current, installments: checked ? 2 : 1 }));
    }

    protected onRecorrenteChange(checked: boolean): void {
        this.recorrente.set(checked);
        this.transactionSchema.update(current => ({
            ...current,
            recurrence: checked ? { frequency: tpRecurrenceFrequencyEnum.MONTHLY, interval: 1 } : undefined,
        }));
    }

    protected onRecurrenceFrequencyChange(value: unknown): void {
        const frequency = (Array.isArray(value) ? value[0] : value) as tpRecurrenceFrequencyEnum;
        this.transactionSchema.update(current => ({
            ...current,
            recurrence: { frequency, interval: current.recurrence?.interval ?? 1 },
        }));
    }

    protected onRecurrenceIntervalChange(value: string | number | null): void {
        const interval = Math.max(1, Number(value) || 1);
        this.transactionSchema.update(current => ({
            ...current,
            recurrence: { frequency: current.recurrence?.frequency ?? tpRecurrenceFrequencyEnum.MONTHLY, interval },
        }));
    }

    protected onAccountChange(value: unknown): void {
        this.transactionSchema.update(current => ({ ...current, accountId: isArrayId(value) }));
    }

    protected onCreditCardChange(value: unknown): void {
        this.transactionSchema.update(current => ({ ...current, creditCardId: isArrayId(value) }));
    }

    protected onCategoryChange(value: unknown): void {
        this.transactionSchema.update(current => ({ ...current, categoryId: isArrayId(value) }));
    }

    protected onDateChange(value: string): void {
        this.transactionSchema.update(current => ({ ...current, date: value }));
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            const payload = this.form().value() as RequestTransactionDto;
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
