import { AiAlertDialogService, AiBadge, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { Router } from "@angular/router";
import { BadgeTpLoan, TableImports } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { tpLoanMap } from "@domain/enums";
import { LoanDto } from "@domain/schemas";
import { LoanService } from "@infra/services";

@Component({
    selector: "ai-table-loan",
    imports: [TableImports, BadgeTpLoan],
    templateUrl: "./table-loan.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLoan implements OnInit {
    #service = inject(LoanService);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);
    #router = inject(Router);

    #loans = signal<LoanDto[]>([]);

    protected readonly tpLoanMap = tpLoanMap;

    readonly edit = output<LoanDto>();

    readonly columns = signal<AiTableColumn<LoanDto>[]>([
        { key: "name", label: "Nome" },
        { key: "type", label: "Tipo" },
        { key: "principalAmount", label: "Valor financiado" },
        { key: "outstandingBalance", label: "Saldo devedor" },
        { key: "installmentsTotal", label: "Parcelas" },
        { key: "installments", label: "Ver parcelas" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<LoanDto>>(() => ({
        columns: this.columns(),
        data: this.#loans(),
    }));

    ngOnInit() {
        this.load();
    }

    load(): void {
        this.#service.find().subscribe(loans => this.#loans.set(loans));
    }

    rowClick(item: LoanDto) {
        this.edit.emit(item);
    }

    onInstallments(event: MouseEvent, item: LoanDto) {
        event.stopPropagation();
        this.#router.navigate(["/loans", item.id, "installments"]);
    }

    onRemove(event: MouseEvent, item: LoanDto) {
        event.stopPropagation();

        this.#alert.confirm({
            ...removeAlertDialog(item.name, "Financiamento"),
            description: "Tem certeza que deseja apagar este financiamento? Todas as parcelas vinculadas serão apagadas.",
            onConfirm: () => this._remove(item),
        });
    }

    private _remove(item: LoanDto): void {
        this.#service.delete(item.id).subscribe({
            next: () => {
                this.#toast.success({ message: "Financiamento apagado com sucesso." });
                this.load();
            },
            error: error => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível apagar o financiamento.") : "Não foi possível apagar o financiamento.";
                this.#toast.destructive({ message: "Erro ao apagar financiamento", description: message });
            },
        });
    }
}
