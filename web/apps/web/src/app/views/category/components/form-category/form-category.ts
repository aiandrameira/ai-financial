import type { AiIconType } from "@aiandralves/ai-ui";
import { AiBadge, AiIcon, AiInput, AiSelectImports, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { disabled, form, FormField, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { BadgeCategory, BadgeTpCategory, ButtonForm } from "@core/ui";
import { tpCategoryEnum } from "@domain/enums";
import { CategoryDto, makeRequestCategory, RequestCategoryDto, requestCategorySchema } from "@domain/schemas";
import { BadgeVariant } from "@domain/types";
import { CategoryAdapter } from "@infra/adapters";
import { CategoryFacade } from "@infra/facades";

const CATEGORY_TYPES = Object.values(tpCategoryEnum);

const CATEGORY_ICONS: AiIconType[] = [
    "restaurant",
    "shopping-cart-2",
    "car",
    "home",
    "heart-pulse",
    "graduation-cap",
    "gift",
    "briefcase",
    "plane",
    "wallet",
    "movie-2",
    "music",
    "store",
    "bank",
    "receipt",
    "umbrella",
    "beer",
    "shapes",
];

const CATEGORY_COLORS: { value: BadgeVariant; label: string }[] = [
    { value: "default", label: "Cinza" },
    { value: "primary", label: "Azul" },
    { value: "accent", label: "Roxo" },
    { value: "outline", label: "Contorno" },
    { value: "destructive", label: "Vermelho" },
    { value: "info", label: "Ciano" },
    { value: "success", label: "Verde" },
    { value: "warning", label: "Amarelo" },
];

@Component({
    selector: "ai-form-category",
    imports: [FormField, AiInput, AiSelectImports, ButtonForm, BadgeTpCategory, BadgeCategory, AiIcon, AiBadge],
    templateUrl: "./form-category.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCategory {
    #toast = inject(AiToastService);
    #facade = inject(CategoryFacade);

    readonly categoryTypes = CATEGORY_TYPES;
    readonly categoryIcons = CATEGORY_ICONS;
    readonly categoryColors = CATEGORY_COLORS;

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

    readonly parentOptions = computed(() => this.#facade.categories().filter(item => item.type === this.categorySchema().type && item.id !== this.id()));

    readonly selectedType = computed(() => this.form().value().type);
    readonly selectedIcon = computed(() => this.form().value().icon);
    readonly selectedColor = computed(() => this.form().value().color as BadgeVariant);
    readonly selectedParent = computed(() => this.parentOptions().find(item => item.id === this.form().value().parentId) ?? null);

    readonly previewCategory = computed<CategoryDto>(() => ({
        id: "",
        name: this.categorySchema().name || "Pré-visualização",
        type: this.categorySchema().type,
        parentId: null,
        icon: this.categorySchema().icon || null,
        color: this.categorySchema().color || null,
        createdAt: "",
        updatedAt: "",
    }));

    constructor() {
        this.#facade.load();

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

    protected onIconChange(value: unknown): void {
        this.categorySchema.update(current => ({ ...current, icon: isArrayId(value) }));
    }

    protected onColorChange(value: unknown): void {
        this.categorySchema.update(current => ({ ...current, color: isArrayId(value) }));
    }

    protected onParentChange(value: unknown): void {
        this.categorySchema.update(current => ({ ...current, parentId: isArrayId(value) }));
    }

    async onSave() {
        this.loading.set(true);
        let submitted = false;

        try {
            await submit(this.form, async () => {
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
        } catch (error) {
            console.error("Erro ao submeter formulário:", error);
        } finally {
            this.loading.set(false);
        }
    }
}
