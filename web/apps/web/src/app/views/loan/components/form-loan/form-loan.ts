import type { AiIconType, AiMaskConfig } from "@aiandralves/ai-ui";
import { AiBadge, AiDatePicker, AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { TpAccountPipe } from "@core/pipes";
import { ButtonForm } from "@core/ui";
import { tpLoanEnum, tpLoanMap } from "@domain/enums";
import { LoanDto, makeRequestLoan, RequestLoanDto, requestLoanSchema } from "@domain/schemas";
import { LoanAdapter } from "@infra/adapters";
import { AccountFacade } from "@infra/facades";

const LOAN_TYPE_ICONS: Record<tpLoanEnum, AiIconType> = {
    [tpLoanEnum.REAL_ESTATE]: "home",
    [tpLoanEnum.VEHICLE]: "car",
    [tpLoanEnum.PERSONAL]: "user",
    [tpLoanEnum.CONSORTIUM]: "group-2",
};

const LOAN_TYPES: { value: tpLoanEnum; label: string; icon: AiIconType }[] = Array.from(tpLoanMap, ([value, label]) => ({
    value,
    label,
    icon: LOAN_TYPE_ICONS[value],
}));

@Component({
    selector: "ai-form-loan",
    imports: [FormField, AiInput, AiBadge, AiSelectImports, ButtonForm, TpAccountPipe, AiDatePicker],
    templateUrl: "./form-loan.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLoan {
    #toast = inject(AiToastService);
    #accountFacade = inject(AccountFacade);

    readonly accounts = this.#accountFacade.accounts;
    readonly loanTypes = LOAN_TYPES;

    readonly loan = input<LoanDto | null>(null);
    readonly id = computed(() => this.loan()?.id ?? "");
    readonly isNew = computed(() => !this.id());

    readonly enabled = signal<boolean>(false);
    protected loanSchema = signal<RequestLoanDto>(makeRequestLoan());

    readonly form = form(this.loanSchema, schema => {
        required(schema.accountId, { message: "Selecione uma conta." });
        validateStandardSchema(schema, requestLoanSchema);
        disabled(schema, this.enabled);
        disabled(schema.principalAmount, () => !this.isNew());
        disabled(schema.interestRate, () => !this.isNew());
        disabled(schema.installmentsTotal, () => !this.isNew());
        disabled(schema.startDate, () => !this.isNew());
    });

    readonly save = output<RequestLoanDto>();
    readonly loading = signal<boolean>(false);

    readonly selectedAccount = computed(() => this.accounts().find(account => account.id === this.form().value().accountId) ?? null);
    readonly selectedType = computed(() => this.loanTypes.find(type => type.value === this.form().value().type) ?? null);

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
            const loan = this.loan();

            untracked(() => {
                if (loan) {
                    this.loanSchema.set(LoanAdapter.toDto(loan));
                    this.enabled.set(true);
                }
            });
        });
    }

    protected onTypeChange(value: unknown): void {
        this.loanSchema.update(current => ({ ...current, type: isArrayId(value) as tpLoanEnum }));
    }

    protected onAccountChange(value: unknown): void {
        this.loanSchema.update(current => ({ ...current, accountId: isArrayId(value) }));
    }

    protected onDateChange(value: string): void {
        this.loanSchema.update(current => ({ ...current, startDate: value }));
    }

    async onSave() {
        this.loading.set(true);
        let submitted = false;

        try {
            await submit(this.form, async () => {
                submitted = true;
                const payload = this.form().value() as RequestLoanDto;
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
