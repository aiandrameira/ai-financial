import { AiAlertDialogService, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { BadgeCategory, BadgeTpCategory, TableImports } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { CategoryDto } from "@domain/schemas";
import { CategoryService } from "@infra/services";

@Component({
    selector: "ai-table-category",
    imports: [TableImports, BadgeTpCategory, BadgeCategory],
    templateUrl: "./table-category.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCategory implements OnInit {
    #service = inject(CategoryService);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    #categories = signal<CategoryDto[]>([]);

    readonly edit = output<CategoryDto>();

    readonly columns = signal<AiTableColumn<CategoryDto>[]>([
        { key: "name", label: "Nome" },
        { key: "type", label: "Tipo" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<CategoryDto>>(() => ({
        columns: this.columns(),
        data: this.#categories(),
    }));

    ngOnInit() {
        this.load();
    }

    load(): void {
        this.#service.find().subscribe(categories => this.#categories.set(categories));
    }

    rowClick(item: CategoryDto) {
        this.edit.emit(item);
    }

    onRemove(event: MouseEvent, item: CategoryDto) {
        event.stopPropagation();

        this.#alert.confirm({
            ...removeAlertDialog(item.name, "Categoria"),
            onConfirm: () => this._remove(item),
        });
    }

    private _remove(item: CategoryDto): void {
        this.#service.delete(item.id).subscribe({
            next: () => {
                this.#toast.success({ message: "Categoria apagada com sucesso." });
                this.load();
            },
            error: error => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível apagar a categoria.") : "Não foi possível apagar a categoria.";
                this.#toast.destructive({ message: "Erro ao apagar categoria", description: message });
            },
        });
    }
}
