import type { AiMaskConfig } from "@aiandralves/ai-ui";
import { AiButton, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from "@angular/core";
import { form, submit, validateStandardSchema } from "@angular/forms/signals";
import { isArrayId } from "@core/helpers";
import { BadgeTpAccount, FormImports } from "@core/ui";
import { TRANSFER_METHOD_ICONS, TRANSFER_METHODS } from "@domain/constants";
import { tpTransferMethodEnum, tpTransferMethodMap } from "@domain/enums";
import { makeRequestTransfer, RequestTransferDto, requestTransferSchema } from "@domain/schemas";
import { TransactionFacade } from "@infra/facades";

@Component({
    selector: "ai-form-transfer",
    imports: [FormImports, AiButton, BadgeTpAccount],
    templateUrl: "./form-transfer.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTransfer {
    #toast = inject(AiToastService);
    #facade = inject(TransactionFacade);

    readonly accounts = this.#facade.accounts;
    readonly transferMethods = TRANSFER_METHODS;
    readonly transferMethodMap = tpTransferMethodMap;
    readonly transferMethodIcons = TRANSFER_METHOD_ICONS;

    protected transferSchema = signal<RequestTransferDto>(makeRequestTransfer());

    readonly form = form(this.transferSchema, schema => {
        validateStandardSchema(schema, requestTransferSchema);
    });

    readonly save = output<RequestTransferDto>();
    readonly loading = signal<boolean>(false);

    readonly selectedSource = computed(() => this.accounts().find(account => account.id === this.form().value().sourceAccountId) ?? null);
    readonly selectedDestination = computed(() => this.accounts().find(account => account.id === this.form().value().destinationAccountId) ?? null);

    vlMaskConfig: AiMaskConfig = {
        isCurrency: true,
        decimal: ",",
        prefix: "R$ ",
        thousands: ".",
        align: "left",
    };

    constructor() {
        this.#facade.load();
    }

    protected onSourceChange(value: unknown): void {
        this.transferSchema.update(current => ({ ...current, sourceAccountId: isArrayId(value) }));
    }

    protected onDestinationChange(value: unknown): void {
        this.transferSchema.update(current => ({ ...current, destinationAccountId: isArrayId(value) }));
    }

    protected onDateChange(value: string): void {
        this.transferSchema.update(current => ({ ...current, date: value }));
    }

    protected onMethodChange(method: tpTransferMethodEnum): void {
        this.transferSchema.update(current => ({ ...current, method }));
    }

    onSave(): void {
        this.loading.set(true);
        let submitted = false;

        submit(this.form, async () => {
            submitted = true;
            this.save.emit(this.form().value() as RequestTransferDto);
        });

        if (!submitted) {
            this.#toast.warning({
                message: "Campos obrigatórios",
                description: "Por favor, preencha todos os campos corretamente.",
            });
        }
        this.loading.set(false);
    }
}
