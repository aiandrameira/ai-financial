import { AiAlertDialogService, AiBadge, AiInput, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { TrendPipe } from "@core/pipes";
import { BadgeTpAsset, createCursorSearchController, IconMaterial, TableImports, toAiTablePagination } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { tpAssetMap } from "@domain/enums";
import { AssetDto } from "@domain/schemas";
import { AssetFacade } from "@infra/facades";

@Component({
    selector: "ai-table-asset",
    imports: [TableImports, AiInput, AiBadge, IconMaterial, BadgeTpAsset, TrendPipe],
    templateUrl: "./table-asset.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableAsset implements OnInit {
    #facade = inject(AssetFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    protected readonly tpAssetMap = tpAssetMap;

    readonly edit = output<AssetDto>();

    readonly paginationConfig = toAiTablePagination(this.#facade, [5, 10, 20, 50]);
    readonly #pageNav = createCursorSearchController(this.#facade);
    readonly query = this.#pageNav.query;
    readonly onQueryChange = this.#pageNav.onQueryChange;
    readonly search = this.#pageNav.search;
    readonly clear = this.#pageNav.clear;
    readonly onPageChange = this.#pageNav.onPageChange;
    readonly onPageSizeChange = this.#pageNav.onPageSizeChange;

    readonly columns = signal<AiTableColumn<AssetDto>[]>([
        { key: "name", label: "Nome" },
        { key: "type", label: "Tipo" },
        { key: "purchaseValue", label: "Valor de aquisição" },
        { key: "currentValue", label: "Valor atual" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<AssetDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.assets(),
    }));

    ngOnInit() {
        this.load();
    }

    load(): void {
        this.#facade.load();
    }

    rowClick(item: AssetDto) {
        this.edit.emit(item);
    }

    onRemove(event: MouseEvent, item: AssetDto) {
        event.stopPropagation();

        this.#alert.confirm({
            ...removeAlertDialog(item.name, "Bem"),
            onConfirm: () => this._remove(item),
        });
    }

    private _remove(item: AssetDto): void {
        this.#facade.delete(item.id).subscribe({
            next: () => {
                this.#toast.success({ message: "Bem apagado com sucesso." });
                this.load();
            },
            error: error => {
                const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível apagar o bem.") : "Não foi possível apagar o bem.";
                this.#toast.destructive({ message: "Erro ao apagar bem", description: message });
            },
        });
    }
}
