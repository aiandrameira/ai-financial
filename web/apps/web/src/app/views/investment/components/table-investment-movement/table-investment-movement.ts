import { AiAlertDialogService, AiBadge, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { DecimalPipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from "@angular/core";
import { formatUtcDateDayjs } from "@core/helpers";
import { BadgeTpInvestmentMovement, createCursorPageNav, TableImports, toAiTablePagination } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { tpInvestmentMovementMap } from "@domain/enums";
import { InvestmentMovementDto } from "@domain/schemas";
import { InvestmentMovementFacade } from "@infra/facades";

@Component({
    selector: "ai-table-investment-movement",
    imports: [TableImports, AiBadge, DecimalPipe, BadgeTpInvestmentMovement],
    templateUrl: "./table-investment-movement.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableInvestmentMovement {
    #facade = inject(InvestmentMovementFacade);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);

    readonly investmentId = input.required<string>();

    protected readonly tpInvestmentMovementMap = tpInvestmentMovementMap;

    readonly paginationConfig = toAiTablePagination(this.#facade, [5, 10, 20, 50]);
    readonly #pageNav = createCursorPageNav(this.#facade);
    readonly onPageChange = this.#pageNav.onPageChange;
    readonly onPageSizeChange = this.#pageNav.onPageSizeChange;

    readonly columns = signal<AiTableColumn<InvestmentMovementDto>[]>([
        { key: "type", label: "Tipo" },
        { key: "quantity", label: "Quantidade" },
        { key: "price", label: "Preço unitário" },
        { key: "amount", label: "Valor" },
        { key: "date", label: "Data" },
        { key: "remove", label: "Apagar" },
    ]);

    readonly config = computed<AiTableConfig<InvestmentMovementDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.movements(),
    }));

    constructor() {
        effect(() => {
            const investmentId = this.investmentId();
            if (investmentId) {
                untracked(() => this.load());
            }
        });
    }

    load(): void {
        this.#facade.load(this.investmentId());
    }

    protected dateLabel(date: string): string {
        return formatUtcDateDayjs(date);
    }

    onRemove(item: InvestmentMovementDto) {
        this.#alert.confirm({
            ...removeAlertDialog(this.tpInvestmentMovementMap.get(item.type) ?? "esta movimentação", "Movimentação"),
            onConfirm: () => this._remove(item),
        });
    }

    private _remove(item: InvestmentMovementDto): void {
        this.#facade.delete(this.investmentId(), item.id).subscribe({
            next: () => {
                this.#toast.success({ message: "Movimentação apagada com sucesso." });
                this.load();
            },
            error: error => {
                const message =
                    error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível apagar a movimentação.") : "Não foi possível apagar a movimentação.";
                this.#toast.destructive({ message: "Erro ao apagar movimentação", description: message });
            },
        });
    }
}
