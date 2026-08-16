import { AiButton, AiDialogService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { InvestmentAssetDto } from "@domain/schemas";

import { DialogInvestment, TableInvestment } from "../../components";

@Component({
    selector: "ai-list-investment",
    imports: [AiButton, AiHeading, TableInvestment],
    templateUrl: "./list-investment.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListInvestmentPage {
    #dialog = inject(AiDialogService);

    protected openCreate(): void {
        this._openDialog(null);
    }

    protected openEdit(asset: InvestmentAssetDto): void {
        this._openDialog(asset);
    }

    private _openDialog(asset: InvestmentAssetDto | null): void {
        const isNew = !asset;

        this.#dialog.create<DialogInvestment, { asset: InvestmentAssetDto | null }>({
            ...formDialogOptions(isNew ? "Cadastrar investimento" : "Editar investimento", "Preencha os dados do ativo.", "line-chart"),
            width: "560px",
            component: DialogInvestment,
            data: { asset },
        });
    }
}
