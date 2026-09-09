import { AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { BadgeTpTransaction, TableImports } from "@core/ui";
import { stTransactionEnum, tpTransactionEnum } from "@domain/enums";
import { makeRequestTransaction, TransactionDto } from "@domain/schemas";
import { TransactionFacade } from "@infra/facades";

@Component({
    selector: "ai-table-bill",
    imports: [TableImports, BadgeTpTransaction],
    templateUrl: "./table-bill.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableBill implements OnInit {
    #facade = inject(TransactionFacade);
    #toast = inject(AiToastService);

    protected abs = (value: number): number => Math.abs(value);

    readonly columns = signal<AiTableColumn<TransactionDto>[]>([
        { key: "date", label: "Data" },
        { key: "type", label: "Tipo" },
        { key: "description", label: "Descrição" },
        { key: "amount", label: "Valor" },
        { key: "pay", label: "Pagar" },
    ]);

    readonly config = computed<AiTableConfig<TransactionDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.transactions(),
    }));

    ngOnInit(): void {
        this.#facade.load({ status: stTransactionEnum.PLANNED });
    }

    markAsPaid(event: MouseEvent, item: TransactionDto): void {
        event.stopPropagation();

        const payload = makeRequestTransaction({
            id: item.id,
            accountId: item.accountId ?? "",
            creditCardId: item.creditCardId ?? "",
            categoryId: item.categoryId ?? "",
            type: item.type as Exclude<tpTransactionEnum, tpTransactionEnum.TRANSFER>,
            amount: Math.abs(Number(item.amount)),
            description: item.description ?? "",
            date: item.date,
            status: stTransactionEnum.COMPLETED,
        });

        this.#facade.update(item.id, payload).subscribe({
            next: () => {
                this.#toast.success({ message: "Conta marcada como paga." });
            },
            error: error => {
                const message =
                    error instanceof HttpErrorResponse
                        ? (error.error?.meta?.message ?? "Não foi possível marcar a conta como paga.")
                        : "Não foi possível marcar a conta como paga.";
                this.#toast.destructive({ message: "Erro ao marcar como paga", description: message });
            },
        });
    }
}
