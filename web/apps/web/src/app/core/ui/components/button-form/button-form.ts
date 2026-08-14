import { AiButton } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";

@Component({
    selector: "ai-button-form",
    imports: [AiButton],
    template: `
        <div class="flex items-center gap-x-2">
            @if (!disabled()) {
                @if (!isNew()) {
                    <ai-button size="sm" variant="default" icon="close-circle" (click)="cancelEdit.emit()"> Cancelar </ai-button>
                }

                @if (showSave()) {
                    <ai-button size="sm" [icon]="!loading() ? icon() : undefined" [disabled]="disabled()" [loading]="loading()" (click)="save.emit()">
                        {{ text() }}
                    </ai-button>
                }
            } @else if (showEdit()) {
                <ai-button size="sm" variant="accent" icon="pencil" (click)="edit.emit()"> Editar </ai-button>
            }
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonForm {
    readonly isNew = input<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly loading = input<boolean>(false);
    readonly showEdit = input<boolean>(true);
    readonly showSave = input<boolean>(true);

    readonly cancelEdit = output<void>();
    readonly edit = output<void>();
    readonly save = output<void>();

    readonly icon = computed(() => (this.isNew() ? "add-circle" : "check-double"));

    readonly text = computed(() => {
        const isNew = this.isNew();
        if (this.loading()) return isNew ? "Cadastrando" : "Salvando";
        return isNew ? "Cadastrar" : "Salvar";
    });
}
