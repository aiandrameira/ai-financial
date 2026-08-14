import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiBadge, AiDatePicker, AiInput, AiSelectImports, AiTextarea, AiToastService } from "@aiandralves/ai-ui";
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

@Component({
    selector: "ai-form-transaction",
    imports: [FormField, AiInput, AiBadge, AiSelectImports, ButtonForm, BadgeTpTransaction, BadgeCategory, TpAccountPipe, AiDatePicker, AiTextarea],
    templateUrl: "./form-transaction.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTransaction {
    #toast = inject(AiToastService);
    #facade = inject(TransactionFacade);

    readonly transactionTypes = TRANSACTION_TYPES;
    readonly accounts = this.#facade.accounts;

    readonly enabled = signal<boolean>(false);
    protected transactionSchema = signal<RequestTransactionDto>(makeRequestTransaction());

    readonly form = form(this.transactionSchema, schema => {
        required(schema.accountId, { message: "Selecione uma conta." });
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
    readonly selectedCategory = computed(() => this.categoriesForType().find(category => category.id === this.form().value().categoryId) ?? null);

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
                    this.transactionSchema.set(TransactionAdapter.toDto(transaction));
                    this.enabled.set(true);
                }
            });
        });
    }

    protected onTypeChange(value: unknown): void {
        const type = (Array.isArray(value) ? value[0] : value) as RequestTransactionDto["type"];
        this.transactionSchema.update(current => ({ ...current, type, categoryId: "" }));
    }

    protected onAccountChange(value: unknown): void {
        this.transactionSchema.update(current => ({ ...current, accountId: isArrayId(value) }));
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
