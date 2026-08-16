import { AiButton, AiDialogService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { AssetDto } from "@domain/schemas";

import { DialogAsset, TableAsset } from "../../components";

@Component({
    selector: "ai-list-asset",
    imports: [AiButton, AiHeading, TableAsset],
    templateUrl: "./list-asset.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListAssetPage {
    #dialog = inject(AiDialogService);

    protected openCreate(): void {
        this._openDialog(null);
    }

    protected openEdit(asset: AssetDto): void {
        this._openDialog(asset);
    }

    private _openDialog(asset: AssetDto | null): void {
        const isNew = !asset;

        this.#dialog.create<DialogAsset, { asset: AssetDto | null }>({
            ...formDialogOptions(isNew ? "Cadastrar bem" : "Editar bem", "Preencha os dados do bem.", "home"),
            width: "560px",
            component: DialogAsset,
            data: { asset },
        });
    }
}
