import { AiAlertDialogService, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { BadgeTpAccount, IconMaterial, TableImports } from "@core/ui";
import { archiveAlertDialog } from "@core/utils";
import { AccountDto } from "@domain/schemas";
import { BadgeVariant } from "@domain/types";
import { AccountFacade } from "@infra/facades";

@Component({
    selector: "ai-table-account",
    imports: [TableImports, BadgeTpAccount, IconMaterial],
    templateUrl: "./table-account.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableAccount implements OnInit {
    #facade = inject(AccountFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    readonly edit = output<AccountDto>();

    protected abs = (value: string): number => Math.abs(Number(value));

    protected balanceTrend(value: string): { variant: BadgeVariant; icon: string } {
        const amount = Number(value);
        if (amount < 0) return { variant: "destructive", icon: "trending_down" };
        if (amount > 0) return { variant: "success", icon: "trending_up" };
        return { variant: "default", icon: "trending_flat" };
    }

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

    private async _archive(item: AccountDto): Promise<void> {
        if (!item.id) return;

        try {
            await this.#facade.archive(item.id);
            this.#toast.success({ message: "Conta arquivada com sucesso." });
        } catch (error) {
            const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível arquivar a conta.") : "Não foi possível arquivar a conta.";
            this.#toast.destructive({ message: "Erro ao arquivar conta", description: message });
        }
    }
}
