import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CategoryDto, RequestCategoryDto } from "@domain/schemas";
import { CategoryFacade } from "@infra/facades";

import { FormCategory } from "../form-category/form-category";

@Component({
    selector: "ai-dialog-category",
    imports: [FormCategory],
    template: `<ai-form-category [category]="data.category" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCategory {
    #facade = inject(CategoryFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogCategory>);

    protected readonly data = inject<{ category: CategoryDto | null }>(AI_DIALOG_DATA as never);

    protected async onSave(payload: RequestCategoryDto): Promise<void> {
        const isNew = !payload.id;

        await this.#facade.save(payload);
        this.#toast.success({ message: isNew ? "Categoria cadastrada com sucesso." : "Categoria atualizada com sucesso." });
        this.#dialogRef.close();
    }
}
