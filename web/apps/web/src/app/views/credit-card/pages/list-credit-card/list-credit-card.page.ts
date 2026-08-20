import { AiButton, AiDialogService, AiToastService } from "@aiandralves/ai-ui";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { CreditCardDto } from "@domain/schemas";
import { NotifyDueInvoicesService } from "@infra/services";

import { DialogCreditCard, TableCreditCard } from "../../components";

@Component({
    selector: "ai-list-credit-card",
    imports: [AiButton, TableCreditCard, AiHeading],
    templateUrl: "./list-credit-card.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCreditCardPage {
    #dialog = inject(AiDialogService);
    #toast = inject(AiToastService);
    #notifyDueInvoices = inject(NotifyDueInvoicesService);

    protected readonly checkingDueInvoices = signal(false);

    protected checkDueInvoices(): void {
        this.checkingDueInvoices.set(true);

        this.#notifyDueInvoices.run().subscribe({
            next: result => {
                this.checkingDueInvoices.set(false);

                if (!result.configured) {
                    this.#toast.warning({ message: "Integração com o AI Flow não configurada", description: "Defina AI_FLOW_API_URL e AI_FLOW_API_KEY no .env da API." });
                    return;
                }

                this.#toast.success({
                    message: `${result.checked} fatura(s) verificada(s), ${result.notified} notificação(ões) enviada(s) ao AI Flow.`,
                    description: result.failed > 0 ? `${result.failed} falharam — veja o log da API.` : undefined,
                });
            },
            error: (error: HttpErrorResponse) => {
                this.checkingDueInvoices.set(false);
                this.#toast.destructive({ message: "Erro ao verificar faturas", description: error.error?.meta?.message ?? error.message });
            },
        });
    }

    protected openCreate() {
        this._openDialog(null);
    }

    protected openEdit(creditCard: CreditCardDto) {
        this._openDialog(creditCard);
    }

    private _openDialog(creditCard: CreditCardDto | null) {
        const isNew = !creditCard;

        this.#dialog.create<DialogCreditCard, { creditCard: CreditCardDto | null }>({
            ...formDialogOptions(isNew ? "Cadastrar cartão" : "Editar cartão", "Preencha os dados do cartão.", "bank-card"),
            width: "900px",
            customClasses: "lg:max-w-[900px] w-full",
            component: DialogCreditCard,
            data: { creditCard },
        });
    }
}
