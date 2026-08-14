import { AiButton, AiDialogService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { CategoryDto } from "@domain/schemas";

import { DialogCategory, TableCategory } from "../../components";

@Component({
    selector: "ai-list-category",
    imports: [AiButton, TableCategory, AiHeading],
    templateUrl: "./list-category.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCategoryPage {
    #dialog = inject(AiDialogService);

    protected openCreate() {
        this._openDialog(null);
    }

    protected openEdit(category: CategoryDto) {
        this._openDialog(category);
    }

    private _openDialog(category: CategoryDto | null) {
        const isNew = !category;

        this.#dialog.create<DialogCategory, { category: CategoryDto | null }>({
            ...formDialogOptions(isNew ? "Cadastrar categoria" : "Editar categoria", "Preencha os dados da categoria.", "shapes"),
            component: DialogCategory,
            data: { category },
        });
    }
}
