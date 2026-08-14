import { AiAlertDialogService, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { BadgeTpAccount, TableImports } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { AccountDto } from "@domain/schemas";
import { AccountFacade } from "@infra/facades";

@Component({
    selector: "ai-table-account",
    imports: [TableImports, BadgeTpAccount],
    templateUrl: "./table-account.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableAccount implements OnInit {
    #facade = inject(AccountFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    readonly edit = output<AccountDto>();

    readonly columns = signal<AiTableColumn<AccountDto>[]>([
        { key: "name", label: "Nome" },
        { key: "type", label: "Tipo" },
        { key: "currentBalance", label: "Saldo atual" },
        { key: "projectedBalance", label: "Saldo projetado" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<AccountDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.accounts(),
    }));

    ngOnInit() {
        this.#facade.load();
    }

    rowClick(item: AccountDto) {
        this.edit.emit(item);
    }

    onRemove(event: MouseEvent, item: AccountDto) {
        event.stopPropagation();

        this.#alert.confirm({
            ...removeAlertDialog(item.name, "Conta"),
            onConfirm: () => this.#toast.default({ message: "Não implementado ainda." }),
        });
    }
}
