import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { BadgeCategory, ButtonForm } from "@core/ui";
import { tpCategoryEnum } from "@domain/enums";
import { BudgetDto, makeRequestBudget, RequestBudgetDto, requestBudgetSchema } from "@domain/schemas";
import { BudgetAdapter } from "@infra/adapters";
import { BudgetFacade, CategoryFacade } from "@infra/facades";

@Component({
    selector: "ai-form-budget",
    imports: [FormField, AiInput, AiSelectImports, ButtonForm, BadgeCategory],
    templateUrl: "./form-budget.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormBudget {
    #toast = inject(AiToastService);
    #categoryFacade = inject(CategoryFacade);
    #budgetFacade = inject(BudgetFacade);

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
        const budgetedCategoryIds = new Set(this.#budgetFacade.budgets().map(budget => budget.categoryId));
        return this.#categoryFacade
            .categories()
            .filter(category => category.type === tpCategoryEnum.EXPENSE)
            .filter(category => !budgetedCategoryIds.has(category.id) || category.id === this.budgetSchema().categoryId);
    });

    readonly selectedCategory = computed(() => this.#categoryFacade.categories().find(category => category.id === this.form().value().categoryId) ?? null);

    vlMaskConfig: AiMaskConfig = {
        isCurrency: true,
        decimal: ",",
        prefix: "R$ ",
        thousands: ".",
        align: "left",
    };

    constructor() {
        this.#categoryFacade.load();

        effect(() => {
            const budget = this.budget();
            const referenceMonth = this.referenceMonth();

            untracked(() => {
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

    async onSave() {
        this.loading.set(true);
        let submitted = false;

        try {
            await submit(this.form, async () => {
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
        } catch (error) {
            console.error("Erro ao submeter formulário:", error);
        } finally {
            this.loading.set(false);
        }
    }
}
