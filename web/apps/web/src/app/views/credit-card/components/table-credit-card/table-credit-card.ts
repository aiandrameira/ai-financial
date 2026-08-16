import { AiAlertDialogService, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { Router } from "@angular/router";
import { BadgeAccount, TableImports } from "@core/ui";
import { archiveAlertDialog } from "@core/utils";
import { CreditCardDto } from "@domain/schemas";
import { CreditCardFacade } from "@infra/facades";

@Component({
    selector: "ai-table-credit-card",
    imports: [TableImports, BadgeAccount],
    templateUrl: "./table-credit-card.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCreditCard implements OnInit {
    #facade = inject(CreditCardFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);
    #router = inject(Router);

    readonly accounts = this.#facade.accounts;

    readonly edit = output<CreditCardDto>();

    readonly columns = signal<AiTableColumn<CreditCardDto>[]>([
        { key: "name", label: "Nome" },
        { key: "accountId", label: "Conta" },
        { key: "limitAmount", label: "Limite" },
        { key: "closingDay", label: "Fechamento", cell: (row: CreditCardDto) => `Dia ${row.closingDay}` },
        { key: "dueDay", label: "Vencimento", cell: (row: CreditCardDto) => `Dia ${row.dueDay}` },
        { key: "invoices", label: "Faturas" },
        { key: "remove", label: "Arquivar" },
    ]);

    readonly config = computed<AiTableConfig<CreditCardDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.creditCards(),
    }));

    protected account(accountId: string) {
        return this.accounts().find(account => account.id === accountId) ?? null;
    }

    ngOnInit() {
        this.load();
    }

    load(): void {
        this.#facade.load();
    }

    rowClick(item: CreditCardDto) {
        this.edit.emit(item);
    }

    onInvoices(event: MouseEvent, item: CreditCardDto) {
        event.stopPropagation();
        this.#router.navigate(["/credit-cards", item.id, "invoices"]);
    }

    onRemove(event: MouseEvent, item: CreditCardDto) {
        event.stopPropagation();

        this.#alert.confirm({
            ...archiveAlertDialog(item.name, "Cartão"),
            onConfirm: () => this._archive(item),
        });
    }

    private _archive(item: CreditCardDto): void {
        this.#facade.archive(item.id).subscribe({
            next: () => {
                this.#toast.success({ message: "Cartão arquivado com sucesso." });
            },
            error: error => {
                const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível arquivar o cartão.") : "Não foi possível arquivar o cartão.";
                this.#toast.destructive({ message: "Erro ao arquivar cartão", description: message });
            },
        });
    }
}
