import { AiAlertDialogService, AiBadge, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { TrendPipe } from "@core/pipes";
import { BadgeTpAsset, IconMaterial, TableImports } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { tpAssetMap } from "@domain/enums";
import { AssetDto } from "@domain/schemas";
import { AssetService } from "@infra/services";

@Component({
    selector: "ai-table-asset",
    imports: [TableImports, AiBadge, IconMaterial, BadgeTpAsset, TrendPipe],
    templateUrl: "./table-asset.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableAsset implements OnInit {
    #service = inject(AssetService);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    #assets = signal<AssetDto[]>([]);

    protected readonly tpAssetMap = tpAssetMap;

    readonly edit = output<AssetDto>();

    readonly columns = signal<AiTableColumn<AssetDto>[]>([
        { key: "name", label: "Nome" },
        { key: "type", label: "Tipo" },
        { key: "purchaseValue", label: "Valor de aquisição" },
        { key: "currentValue", label: "Valor atual" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<AssetDto>>(() => ({
        columns: this.columns(),
        data: this.#assets(),
    }));

    ngOnInit() {
        this.load();
    }

    load(): void {
        this.#service.find().subscribe(assets => this.#assets.set(assets));
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
        this.#service.delete(item.id).subscribe({
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
