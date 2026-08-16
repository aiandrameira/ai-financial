import { AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { BadgeCategory, BadgeTpCategory, ButtonForm } from "@core/ui";
import { CATEGORY_TYPES } from "@domain/constants";
import { tpCategoryEnum } from "@domain/enums";
import { CategoryDto, makeRequestCategory, RequestCategoryDto, requestCategorySchema } from "@domain/schemas";
import { CategoryAdapter } from "@infra/adapters";
import { CategoryService } from "@infra/services";

@Component({
    selector: "ai-form-category",
    imports: [FormField, AiInput, AiSelectImports, ButtonForm, BadgeTpCategory, BadgeCategory],
    templateUrl: "./form-category.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCategory {
    #toast = inject(AiToastService);
    #service = inject(CategoryService);

    #categories = signal<CategoryDto[]>([]);

    readonly categoryTypes = CATEGORY_TYPES;

    readonly enabled = signal<boolean>(false);
    protected categorySchema = signal<RequestCategoryDto>(makeRequestCategory());

    readonly form = form(this.categorySchema, schema => {
        required(schema.name, { message: "O campo nome é obrigatório." });
        validateStandardSchema(schema, requestCategorySchema);
        disabled(schema, this.enabled);
    });

    readonly save = output<RequestCategoryDto>();
    readonly loading = signal<boolean>(false);

    readonly category = input<CategoryDto | null>(null);
    readonly id = computed(() => this.category()?.id ?? "");

    readonly parentOptions = computed(() => this.#categories().filter(item => item.type === this.categorySchema().type && item.id !== this.id()));

    readonly selectedType = computed(() => this.form().value().type);
    readonly selectedParent = computed(() => this.parentOptions().find(item => item.id === this.form().value().parentId) ?? null);

    constructor() {
        this.#service.find().subscribe(categories => this.#categories.set(categories));

        effect(() => {
            const category = this.category();

            untracked(() => {
                if (category) {
                    this.categorySchema.set(CategoryAdapter.toDto(category));
                    this.enabled.set(true);
                }
            });
        });
    }

    protected onTypeChange(value: unknown): void {
        const type = (Array.isArray(value) ? value[0] : value) as tpCategoryEnum;
        this.categorySchema.update(current => ({ ...current, type, parentId: "" }));
    }

    protected onParentChange(value: unknown): void {
        this.categorySchema.update(current => ({ ...current, parentId: isArrayId(value) }));
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            const payload = this.form().value() as RequestCategoryDto;
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
