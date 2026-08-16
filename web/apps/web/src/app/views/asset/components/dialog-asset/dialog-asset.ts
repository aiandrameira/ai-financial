import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AssetDto, RequestAssetDto } from "@domain/schemas";
import { AssetFacade } from "@infra/facades";

import { FormAsset } from "../form-asset/form-asset";

@Component({
    selector: "ai-dialog-asset",
    imports: [FormAsset],
    template: `<ai-form-asset [asset]="data.asset" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAsset {
    #facade = inject(AssetFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogAsset>);

    protected readonly data = inject<{ asset: AssetDto | null }>(AI_DIALOG_DATA as never);

    protected async onSave(payload: RequestAssetDto): Promise<void> {
        const isNew = !payload.id;

        await this.#facade.save(payload);
        this.#toast.success({ message: isNew ? "Bem cadastrado com sucesso." : "Bem atualizado com sucesso." });
        this.#dialogRef.close();
    }
}
