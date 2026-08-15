import type { AiButtonToggleItem, AiMaskConfig } from "@aiandralves/ai-ui";
import { AiBadge, AiButtonToggle, AiDatePicker, AiInput, AiSelectImports, AiSwitch, AiTextarea, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { TpAccountPipe } from "@core/pipes";
import { BadgeCategory, BadgeTpTransaction, ButtonForm } from "@core/ui";
import { matchesCategoryType } from "@core/utils";
import { tpTransactionEnum } from "@domain/enums";
import { makeRequestTransaction, RequestTransactionDto, requestTransactionSchema, TransactionDto } from "@domain/schemas";
import { TransactionAdapter } from "@infra/adapters";
import { TransactionFacade } from "@infra/facades";

const TRANSACTION_TYPES = Object.values(tpTransactionEnum).filter(type => type !== tpTransactionEnum.TRANSFER);

type TransactionOrigin = "account" | "creditCard";

const ORIGIN_ITEMS: AiButtonToggleItem[] = [
    { value: "account", label: "Conta", icon: "bank" },
    { value: "creditCard", label: "Cartão", icon: "bank-card" },
];

@Component({
    selector: "ai-form-transaction",
    imports: [FormField, AiInput, AiBadge, AiButtonToggle, AiSwitch, AiSelectImports, ButtonForm, BadgeTpTransaction, BadgeCategory, TpAccountPipe, AiDatePicker, AiTextarea],
    templateUrl: "./form-transaction.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTransaction {
    #toast = inject(AiToastService);
    #facade = inject(TransactionFacade);

    readonly transactionTypes = TRANSACTION_TYPES;
    readonly accounts = this.#facade.accounts;
    readonly creditCards = this.#facade.creditCards;
    readonly originItems = ORIGIN_ITEMS;

    readonly enabled = signal<boolean>(false);
    readonly origin = signal<TransactionOrigin>("account");
    readonly parcelar = signal<boolean>(false);
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
        this.transactionSchema.update(current => ({ ...current, accountId: "", creditCardId: "", installments: 1 }));
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

    async onSave() {
        this.loading.set(true);
        let submitted = false;

        try {
            await submit(this.form, async () => {
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
        } catch (error) {
            console.error("Erro ao submeter formulário:", error);
        } finally {
            this.loading.set(false);
        }
    }
}
