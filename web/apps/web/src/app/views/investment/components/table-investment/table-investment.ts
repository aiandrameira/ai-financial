import { AiAlertDialogService, AiBadge, AiTableColumn, AiTableConfig, AiToastService } from "@aiandralves/ai-ui";
import { DecimalPipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IconMaterial, TableImports } from "@core/ui";
import { removeAlertDialog } from "@core/utils";
import { tpInvestmentMap } from "@domain/enums";
import { InvestmentAssetDto } from "@domain/schemas";
import { BadgeVariant } from "@domain/types";
import { InvestmentService } from "@infra/services";

@Component({
    selector: "ai-table-investment",
    imports: [TableImports, AiBadge, IconMaterial, DecimalPipe],
    templateUrl: "./table-investment.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableInvestment implements OnInit {
    #service = inject(InvestmentService);
    #alert = inject(AiAlertDialogService);
    #toast = inject(AiToastService);
    #router = inject(Router);

    #assets = signal<InvestmentAssetDto[]>([]);

    protected readonly tpInvestmentMap = tpInvestmentMap;

    readonly edit = output<InvestmentAssetDto>();

    protected profitTrend(value: number): { variant: BadgeVariant; icon: string } {
        if (value < 0) return { variant: "destructive", icon: "trending_down" };
        if (value > 0) return { variant: "success", icon: "trending_up" };
        return { variant: "default", icon: "trending_flat" };
    }

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
        data: this.#assets(),
    }));

    ngOnInit() {
        this.load();
    }

    load(): void {
        this.#service.find().subscribe(assets => this.#assets.set(assets));
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
        this.#service.delete(item.id).subscribe({
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
