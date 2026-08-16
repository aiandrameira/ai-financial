import { AI_DIALOG_DATA, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AssetDto, RequestAssetDto } from "@domain/schemas";
import { AssetService } from "@infra/services";
import { Observable } from "rxjs";

import { FormAsset } from "../form-asset/form-asset";

@Component({
    selector: "ai-dialog-asset",
    imports: [FormAsset],
    template: `<ai-form-asset [asset]="data.asset" (save)="onSave($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAsset {
    #service = inject(AssetService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogAsset>);

    protected readonly data = inject<{ asset: AssetDto | null }>(AI_DIALOG_DATA as never);

    protected onSave(payload: RequestAssetDto): void {
        const isNew = !payload.id;
        const request$: Observable<unknown> = payload.id ? this.#service.update(payload.id, payload) : this.#service.create(payload);

        request$.subscribe({
            next: () => {
                this.#toast.success({ message: isNew ? "Bem cadastrado com sucesso." : "Bem atualizado com sucesso." });
                this.#dialogRef.close();
            },
            error: (error: unknown) => {
                const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível salvar o bem.") : "Não foi possível salvar o bem.";
                this.#toast.destructive({ message: "Erro ao salvar bem", description: message });
            },
        });
    }
}
