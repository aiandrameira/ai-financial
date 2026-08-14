import { AiAlertDialogService, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { TpCategoryPipe } from "@core/pipes";
import { BadgeStTransaction, BadgeTpTransaction, TableImports } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { TransactionDto } from "@domain/schemas";
import { TransactionFacade } from "@infra/facades";

@Component({
    selector: "ai-table-transaction",
    imports: [TableImports, BadgeTpTransaction, BadgeStTransaction, TpCategoryPipe],
    templateUrl: "./table-transaction.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTransaction implements OnInit {
    #facade = inject(TransactionFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    readonly edit = output<TransactionDto>();

    protected abs = (value: number): number => Math.abs(value);

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
        this.#facade.load();
    }

    rowClick(item: TransactionDto) {
        this.edit.emit(item);
    }

    onRemove(event: MouseEvent, item: TransactionDto) {
        event.stopPropagation();

        this.#alert.confirm({
            ...removeAlertDialog(item.description ?? "esta transação", "Transação"),
            onConfirm: () => this.#toast.default({ message: "Não implementado ainda." }),
        });
    }
}
