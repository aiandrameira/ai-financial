import { AI_DIALOG_DATA, AiButton, AiDialogRef, AiIcon, AiToastService } from "@aiandralves/ai-ui";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { finalize } from "rxjs";

import { formatMonthYearDayjs, formatUtcDateDayjs } from "@core/helpers";
import { StInvoicePipe } from "@core/pipes";
import { BadgeStInvoice, InfoCard } from "@core/ui";
import { stInvoiceEnum, stInvoiceMap } from "@domain/enums";
import { CreditCardInvoiceDto } from "@domain/schemas";
import { CreditCardInvoiceFacade } from "@infra/facades";

@Component({
    selector: "ai-dialog-credit-card-invoice",
    imports: [AiButton, AiIcon, CurrencyPipe, DatePipe, BadgeStInvoice, StInvoicePipe, InfoCard],
    templateUrl: "./dialog-credit-card-invoice.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCreditCardInvoice implements OnInit {
    #facade = inject(CreditCardInvoiceFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogCreditCardInvoice>);

    protected readonly data = inject<{ creditCardId: string; invoice: CreditCardInvoiceDto }>(AI_DIALOG_DATA as never);

    protected readonly stInvoiceMap = stInvoiceMap;
    protected readonly stInvoiceEnum = stInvoiceEnum;
    protected readonly referenceMonthLabel = computed(() => formatMonthYearDayjs(this.data.invoice.referenceMonth));
    protected readonly closingDateLabel = computed(() => formatUtcDateDayjs(this.data.invoice.closingDate));
    protected readonly dueDateLabel = computed(() => formatUtcDateDayjs(this.data.invoice.dueDate));

    readonly transactions = this.#facade.invoiceTransactions;
    readonly loading = this.#facade.loadingTransactions;
    readonly paying = signal(false);

    protected abs(val: number | string | null | undefined): number {
        if (val === null || val === undefined) return 0;
        const num = typeof val === "number" ? val : parseFloat(val);
        return isNaN(num) ? 0 : Math.abs(num);
    }

    ngOnInit(): void {
        this.#facade.loadInvoiceTransactions(this.data.invoice.id);
    }

    protected onPay(): void {
        this.paying.set(true);
        this.#facade
            .payInvoice(this.data.creditCardId, this.data.invoice.id)
            .pipe(finalize(() => this.paying.set(false)))
            .subscribe({
                next: () => {
                    this.#toast.success({ message: "Fatura paga com sucesso." });
                    this.#dialogRef.close();
                },
                error: error => {
                    const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível pagar a fatura.") : "Não foi possível pagar a fatura.";
                    this.#toast.destructive({ message: "Erro ao pagar fatura", description: message });
                },
            });
    }
}
