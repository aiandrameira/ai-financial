import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CategoryDto, RequestCategoryDto } from "@domain/schemas";
import { CategoryService } from "@infra/services";
import { Observable } from "rxjs";

import { FormCategory } from "../form-category/form-category";

@Component({
    selector: "ai-dialog-category",
    imports: [FormCategory],
    template: `<ai-form-category [category]="data.category" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCategory {
    #service = inject(CategoryService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogCategory>);

    protected readonly data = inject<{ category: CategoryDto | null }>(AI_DIALOG_DATA as never);

    protected onSave(payload: RequestCategoryDto): void {
        const isNew = !payload.id;
        const request$: Observable<unknown> = payload.id ? this.#service.update(payload.id, payload) : this.#service.create(payload);

        request$.subscribe({
            next: () => {
                this.#toast.success({ message: isNew ? "Categoria cadastrada com sucesso." : "Categoria atualizada com sucesso." });
                this.#dialogRef.close();
            },
            error: (error: unknown) => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível salvar a categoria.") : "Não foi possível salvar a categoria.";
                this.#toast.destructive({ message: "Erro ao salvar categoria", description: message });
            },
        });
    }
}
