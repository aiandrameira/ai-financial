import { AiAlertDialogService, AiBadge, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { TpAccountPipe } from "@core/pipes";
import { TableImports } from "@core/ui";
import { archiveAlertDialog } from "@core/utils";
import { CreditCardDto } from "@domain/schemas";
import { AccountFacade, CreditCardFacade } from "@infra/facades";

@Component({
    selector: "ai-table-credit-card",
    imports: [TableImports, AiBadge, TpAccountPipe],
    templateUrl: "./table-credit-card.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCreditCard implements OnInit {
    #facade = inject(CreditCardFacade);
    #accountFacade = inject(AccountFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    readonly accounts = this.#accountFacade.accounts;

    readonly edit = output<CreditCardDto>();

    readonly columns = signal<AiTableColumn<CreditCardDto>[]>([
        { key: "name", label: "Nome" },
        { key: "accountId", label: "Conta" },
        { key: "limitAmount", label: "Limite" },
        { key: "closingDay", label: "Fechamento" },
        { key: "dueDay", label: "Vencimento" },
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
        this.#facade.load();
        this.#accountFacade.load();
    }

    rowClick(item: CreditCardDto) {
        this.edit.emit(item);
    }

    onRemove(event: MouseEvent, item: CreditCardDto) {
        event.stopPropagation();

        this.#alert.confirm({
            ...archiveAlertDialog(item.name, "Cartão"),
            onConfirm: () => this._archive(item),
        });
    }

    private async _archive(item: CreditCardDto): Promise<void> {
        try {
            await this.#facade.archive(item.id);
            this.#toast.success({ message: "Cartão arquivado com sucesso." });
        } catch (error) {
            const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível arquivar o cartão.") : "Não foi possível arquivar o cartão.";
            this.#toast.destructive({ message: "Erro ao arquivar cartão", description: message });
        }
    }
}
