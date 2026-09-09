import { AiAlertDialogService, AiInput, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { TpTransactionPipe } from "@core/pipes";
import { BadgeStTransaction, BadgeTpTransaction, createCursorSearchController, IconMaterial, TableImports, toAiTablePagination } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { tpTransactionEnum, tpTransactionTrendIconMap } from "@domain/enums";
import { TransactionDto } from "@domain/schemas";
import { TransactionFacade } from "@infra/facades";

@Component({
    selector: "ai-table-transaction",
    imports: [TableImports, AiInput, BadgeTpTransaction, BadgeStTransaction, TpTransactionPipe, IconMaterial],
    templateUrl: "./table-transaction.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTransaction implements OnInit {
    #facade = inject(TransactionFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    readonly edit = output<TransactionDto>();

    protected abs = (value: number): number => Math.abs(value);
    protected trendIcon = (type: tpTransactionEnum): string | null => tpTransactionTrendIconMap.get(type) ?? null;

    readonly paginationConfig = toAiTablePagination(this.#facade, [5, 10, 20, 50]);
    readonly #pageNav = createCursorSearchController(this.#facade);
    readonly query = this.#pageNav.query;
    readonly onQueryChange = this.#pageNav.onQueryChange;
    readonly search = this.#pageNav.search;
    readonly clear = this.#pageNav.clear;
    readonly onPageChange = this.#pageNav.onPageChange;
    readonly onPageSizeChange = this.#pageNav.onPageSizeChange;

    readonly columns = signal<AiTableColumn<TransactionDto>[]>([
        { key: "date", label: "Data" },
        { key: "type", label: "Tipo" },
        { key: "description", label: "Descrição" },
        { key: "amount", label: "Valor" },
        { key: "status", label: "Status" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<TransactionDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.transactions(),
    }));

    ngOnInit() {
        this.#facade.load({});
    }

    rowClick(item: TransactionDto) {
        this.edit.emit(item);
    }

    onRemove(event: MouseEvent, item: TransactionDto) {
        event.stopPropagation();

        const transferId = item.transferId;
        if (transferId) {
            this.#alert.confirm({
                ...removeAlertDialog("esta transferência", "Transferência"),
                description: "Tem certeza que deseja apagar esta transferência? As duas transações vinculadas (origem e destino) serão apagadas.",
                onConfirm: () => this._removeTransfer(transferId),
            });
            return;
        }

        if (item.installmentGroupId) {
            this.#alert.confirm({
                ...removeAlertDialog("esta compra parcelada", "Compra parcelada"),
                description: `Tem certeza que deseja apagar esta compra? Todas as ${item.installmentsTotal} parcelas vinculadas serão apagadas.`,
                onConfirm: () => this._remove(item),
            });
            return;
        }

        this.#alert.confirm({
            ...removeAlertDialog(item.description ?? "esta transação", "Transação"),
            onConfirm: () => this._remove(item),
        });
    }

    private _remove(item: TransactionDto): void {
        this.#facade.delete(item.id).subscribe({
            next: () => {
                this.#toast.success({ message: "Transação apagada com sucesso." });
            },
            error: error => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível apagar a transação.") : "Não foi possível apagar a transação.";
                this.#toast.destructive({ message: "Erro ao apagar transação", description: message });
            },
        });
    }

    private _removeTransfer(transferId: string): void {
        this.#facade.deleteTransfer(transferId).subscribe({
            next: () => {
                this.#toast.success({ message: "Transferência apagada com sucesso." });
            },
            error: error => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível apagar a transferência.") : "Não foi possível apagar a transferência.";
                this.#toast.destructive({ message: "Erro ao apagar transferência", description: message });
            },
        });
    }
}
