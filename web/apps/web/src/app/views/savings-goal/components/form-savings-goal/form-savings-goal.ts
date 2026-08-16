import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { BadgeTpAccount, FormImports } from "@core/ui";
import { SAVINGS_GOAL_ICONS } from "@domain/constants";
import { AccountDto, makeRequestSavingsGoal, RequestSavingsGoalDto, requestSavingsGoalSchema, SavingsGoalDto } from "@domain/schemas";
import { SavingsGoalAdapter } from "@infra/adapters";
import { AccountService } from "@infra/services";

@Component({
    selector: "ai-form-savings-goal",
    imports: [FormImports, BadgeTpAccount],
    templateUrl: "./form-savings-goal.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSavingsGoal {
    #toast = inject(AiToastService);
    #accountService = inject(AccountService);

    #accounts = signal<AccountDto[]>([]);
    readonly accounts = this.#accounts.asReadonly();
    readonly goalIcons = SAVINGS_GOAL_ICONS;

    readonly goal = input<SavingsGoalDto | null>(null);
    readonly id = computed(() => this.goal()?.id ?? "");
    readonly isNew = computed(() => !this.id());

    readonly enabled = signal<boolean>(false);
    protected goalSchema = signal<RequestSavingsGoalDto>(makeRequestSavingsGoal());

    readonly form = form(this.goalSchema, schema => {
        required(schema.name, { message: "O campo nome é obrigatório." });
        validateStandardSchema(schema, requestSavingsGoalSchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestSavingsGoalDto>();
    readonly loading = signal<boolean>(false);

    readonly selectedIcon = computed(() => this.goalIcons.find(item => item.value === this.form().value().icon) ?? null);
    readonly selectedAccount = computed(() => this.accounts().find(account => account.id === this.form().value().linkedAccountId) ?? null);

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
            const goal = this.goal();

            untracked(() => {
                if (goal) {
                    this.goalSchema.set(SavingsGoalAdapter.toDto(goal));
                    this.enabled.set(true);
                }
            });
        });
    }

    protected onIconChange(value: unknown): void {
        this.goalSchema.update(current => ({ ...current, icon: isArrayId(value) }));
    }

    protected onAccountChange(value: unknown): void {
        this.goalSchema.update(current => ({ ...current, linkedAccountId: isArrayId(value) }));
    }

    protected onDateChange(value: string): void {
        this.goalSchema.update(current => ({ ...current, targetDate: value }));
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            const payload = this.form().value() as RequestSavingsGoalDto;
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
