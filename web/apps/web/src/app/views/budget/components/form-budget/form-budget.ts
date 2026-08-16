import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { BadgeCategory, ButtonForm } from "@core/ui";
import { tpCategoryEnum } from "@domain/enums";
import { BudgetDto, makeRequestBudget, RequestBudgetDto, requestBudgetSchema } from "@domain/schemas";
import { BudgetAdapter } from "@infra/adapters";
import { BudgetFacade } from "@infra/facades";

@Component({
    selector: "ai-form-budget",
    imports: [FormField, AiInput, AiSelectImports, ButtonForm, BadgeCategory],
    templateUrl: "./form-budget.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormBudget {
    #toast = inject(AiToastService);
    #facade = inject(BudgetFacade);

    readonly referenceMonth = input.required<string>();
    readonly budget = input<BudgetDto | null>(null);

    readonly enabled = signal<boolean>(false);
    protected budgetSchema = signal<RequestBudgetDto>(makeRequestBudget());

    readonly form = form(this.budgetSchema, schema => {
        required(schema.categoryId, { message: "Selecione uma categoria." });
        validateStandardSchema(schema, requestBudgetSchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestBudgetDto>();
    readonly loading = signal<boolean>(false);

    readonly id = computed(() => this.budget()?.id ?? "");

    readonly availableCategories = computed(() => {
        const budgetedCategoryIds = new Set(this.#facade.budgets().map(budget => budget.categoryId));
        return this.#facade
            .categories()
            .filter(category => category.type === tpCategoryEnum.EXPENSE)
            .filter(category => !budgetedCategoryIds.has(category.id) || category.id === this.budgetSchema().categoryId);
    });

    readonly selectedCategory = computed(() => this.#facade.categories().find(category => category.id === this.form().value().categoryId) ?? null);

    vlMaskConfig: AiMaskConfig = {
        isCurrency: true,
        decimal: ",",
        prefix: "R$ ",
        thousands: ".",
        align: "left",
    };

    constructor() {
        effect(() => {
            const budget = this.budget();
            const referenceMonth = this.referenceMonth();

            untracked(() => {
                this.#facade.load(referenceMonth);
                if (budget) {
                    this.budgetSchema.set(BudgetAdapter.toDto(budget));
                    this.enabled.set(true);
                } else {
                    this.budgetSchema.update(current => ({ ...current, referenceMonth }));
                }
            });
        });
    }

    protected onCategoryChange(value: unknown): void {
        this.budgetSchema.update(current => ({ ...current, categoryId: isArrayId(value) }));
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            const payload = this.form().value() as RequestBudgetDto;
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
