import { AiAlertDialogService, AiBadge, AiInput, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { DecimalPipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { Router } from "@angular/router";
import { TrendPipe } from "@core/pipes";
import { BadgeTpInvestment, createCursorSearchController, IconMaterial, TableImports, toAiTablePagination } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { tpInvestmentMap } from "@domain/enums";
import { InvestmentAssetDto } from "@domain/schemas";
import { InvestmentFacade } from "@infra/facades";

@Component({
    selector: "ai-table-investment",
    imports: [TableImports, AiInput, AiBadge, IconMaterial, DecimalPipe, BadgeTpInvestment, TrendPipe],
    templateUrl: "./table-investment.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableInvestment implements OnInit {
    #facade = inject(InvestmentFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);
    #router = inject(Router);

    protected readonly tpInvestmentMap = tpInvestmentMap;

    readonly edit = output<InvestmentAssetDto>();

    readonly paginationConfig = toAiTablePagination(this.#facade, [5, 10, 20, 50]);
    readonly #pageNav = createCursorSearchController(this.#facade);
    readonly query = this.#pageNav.query;
    readonly onQueryChange = this.#pageNav.onQueryChange;
    readonly search = this.#pageNav.search;
    readonly clear = this.#pageNav.clear;
    readonly onPageChange = this.#pageNav.onPageChange;
    readonly onPageSizeChange = this.#pageNav.onPageSizeChange;

    readonly columns = signal<AiTableColumn<InvestmentAssetDto>[]>([
        { key: "name", label: "Nome" },
        { key: "type", label: "Tipo" },
        { key: "quantity", label: "Quantidade" },
        { key: "averagePrice", label: "Preço médio" },
        { key: "investedAmount", label: "Valor investido" },
        { key: "currentValue", label: "Valor atual" },
        { key: "profitLoss", label: "Resultado" },
        { key: "movements", label: "Ver movimentações" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<InvestmentAssetDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.assets(),
    }));

    ngOnInit() {
        this.load();
    }

    load(): void {
        this.#facade.load();
    }

    rowClick(item: InvestmentAssetDto) {
        this.edit.emit(item);
    }

    onMovements(event: MouseEvent, item: InvestmentAssetDto) {
        event.stopPropagation();
        this.#router.navigate(["/investments", item.id, "movements"]);
    }

    onRemove(event: MouseEvent, item: InvestmentAssetDto) {
        event.stopPropagation();

        this.#alert.confirm({
            ...removeAlertDialog(item.name, "Investimento"),
            description: "Tem certeza que deseja apagar este investimento? Todas as movimentações e o histórico de preços serão apagados.",
            onConfirm: () => this._remove(item),
        });
    }

    private _remove(item: InvestmentAssetDto): void {
        this.#facade.delete(item.id).subscribe({
            next: () => {
                this.#toast.success({ message: "Investimento apagado com sucesso." });
                this.load();
            },
            error: error => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível apagar o investimento.") : "Não foi possível apagar o investimento.";
                this.#toast.destructive({ message: "Erro ao apagar investimento", description: message });
            },
        });
    }
}
