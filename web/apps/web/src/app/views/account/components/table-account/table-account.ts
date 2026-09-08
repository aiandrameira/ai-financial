import { AiAlertDialogService, AiInput, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { TrendPipe } from "@core/pipes";
import { BadgeTpAccount, createCursorSearchController, IconMaterial, TableImports, toAiTablePagination } from "@core/ui";
import { archiveAlertDialog } from "@core/utils";
import { AccountDto } from "@domain/schemas";
import { AccountFacade } from "@infra/facades";

@Component({
    selector: "ai-table-account",
    imports: [TableImports, AiInput, BadgeTpAccount, IconMaterial, TrendPipe],
    templateUrl: "./table-account.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableAccount implements OnInit {
    #facade = inject(AccountFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    readonly edit = output<AccountDto>();

    protected abs = (value: string): number => Math.abs(Number(value));

    readonly paginationConfig = toAiTablePagination(this.#facade, [5, 10, 20, 50]);
    readonly #pageNav = createCursorSearchController(this.#facade);
    readonly query = this.#pageNav.query;
    readonly onQueryChange = this.#pageNav.onQueryChange;
    readonly search = this.#pageNav.search;
    readonly clear = this.#pageNav.clear;
    readonly onPageChange = this.#pageNav.onPageChange;
    readonly onPageSizeChange = this.#pageNav.onPageSizeChange;

    readonly columns = signal<AiTableColumn<AccountDto>[]>([
        { key: "name", label: "Nome" },
        { key: "type", label: "Tipo" },
        { key: "currentBalance", label: "Saldo atual" },
        { key: "projectedBalance", label: "Saldo projetado" },
        { key: "remove", label: "Arquivar" },
    ]);

    readonly config = computed<AiTableConfig<AccountDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.accounts(),
    }));

    ngOnInit() {
        this.load();
    }

    load(): void {
        this.#facade.load();
    }

    rowClick(item: AccountDto) {
        this.edit.emit(item);
    }

    onRemove(event: MouseEvent, item: AccountDto) {
        event.stopPropagation();

        this.#alert.confirm({
            ...archiveAlertDialog(item.name, "Conta"),
            onConfirm: () => this._archive(item),
        });
    }

    private _archive(item: AccountDto): void {
        if (!item.id) return;

        this.#facade.archive(item.id).subscribe({
            next: () => {
                this.#toast.success({ message: "Conta arquivada com sucesso." });
                this.load();
            },
            error: error => {
                const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível arquivar a conta.") : "Não foi possível arquivar a conta.";
                this.#toast.destructive({ message: "Erro ao arquivar conta", description: message });
            },
        });
    }
}
