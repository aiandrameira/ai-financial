import type { AiIconType, AiMaskConfig } from "@aiandralves/ai-ui";
import { AiBadge, AiDatePicker, AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { TpAccountPipe } from "@core/pipes";
import { ButtonForm } from "@core/ui";
import { makeRequestSavingsGoal, RequestSavingsGoalDto, requestSavingsGoalSchema, SavingsGoalDto } from "@domain/schemas";
import { SavingsGoalAdapter } from "@infra/adapters";
import { AccountFacade } from "@infra/facades";

const GOAL_ICONS: { value: string; label: string; icon: AiIconType }[] = [
    { value: "shield-check", label: "Reserva de emergência", icon: "shield-check" },
    { value: "flight-takeoff", label: "Viagem", icon: "flight-takeoff" },
    { value: "home", label: "Entrada de imóvel", icon: "home" },
    { value: "car-washing", label: "Veículo", icon: "car-washing" },
    { value: "graduation-cap", label: "Educação", icon: "graduation-cap" },
    { value: "box-3", label: "Outro", icon: "box-3" },
];

@Component({
    selector: "ai-form-savings-goal",
    imports: [FormField, AiInput, AiBadge, AiSelectImports, ButtonForm, TpAccountPipe, AiDatePicker],
    templateUrl: "./form-savings-goal.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSavingsGoal {
    #toast = inject(AiToastService);
    #accountFacade = inject(AccountFacade);

    readonly accounts = this.#accountFacade.accounts;
    readonly goalIcons = GOAL_ICONS;

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
        this.#accountFacade.load();

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

    async onSave() {
        this.loading.set(true);
        let submitted = false;

        try {
            await submit(this.form, async () => {
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
        } catch (error) {
            console.error("Erro ao submeter formulário:", error);
        } finally {
            this.loading.set(false);
        }
    }
}
