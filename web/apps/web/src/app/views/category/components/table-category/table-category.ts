import { AiAlertDialogService, AiInput, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { BadgeCategory, BadgeTpCategory, createCursorSearchController, TableImports, toAiTablePagination } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { CategoryDto } from "@domain/schemas";
import { CategoryFacade } from "@infra/facades";

@Component({
    selector: "ai-table-category",
    imports: [TableImports, AiInput, BadgeTpCategory, BadgeCategory],
    templateUrl: "./table-category.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCategory implements OnInit {
    #facade = inject(CategoryFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    readonly edit = output<CategoryDto>();

    readonly paginationConfig = toAiTablePagination(this.#facade, [5, 10, 20, 50]);
    readonly #pageNav = createCursorSearchController(this.#facade);
    readonly query = this.#pageNav.query;
    readonly onQueryChange = this.#pageNav.onQueryChange;
    readonly search = this.#pageNav.search;
    readonly clear = this.#pageNav.clear;
    readonly onPageChange = this.#pageNav.onPageChange;
    readonly onPageSizeChange = this.#pageNav.onPageSizeChange;

    readonly columns = signal<AiTableColumn<CategoryDto>[]>([
        { key: "name", label: "Nome" },
        { key: "type", label: "Tipo" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<CategoryDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.categories(),
    }));

    ngOnInit() {
        this.load();
    }

    load(): void {
        this.#facade.load();
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
        this.#facade.delete(item.id).subscribe({
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
